require "net/http"
require "uri"

class Post < ApplicationRecord
  belongs_to :poster, :foreign_key => :poster_id, class_name: "User"
  belongs_to :recipient, :foreign_key => :recipient_id, class_name: "User"
  #after_create :alarm_create, if: -> {alarm.present?}
  #after_update :alarm_changes, if: -> {saved_change_to_alarm? || saved_change_to_body? || saved_change_to_date?}
  #before_destroy :alarm_destroy, if: -> {alarm.present?}

  after_create :create_reminders, if: -> {alarm.present?}
  after_create :new_jotty_notifications, if: -> {recipient != poster}
  before_create :check_permission
  after_update :update_reminders, if: -> {saved_change_to_alarm?}
  before_destroy :destroy_reminders
  after_create :new_first_jotty_notification, if: -> {recipient != poster && !recipient.friends.include?(poster)}

  def check_permission
    if self.poster == self.recipient #check if user create Jotty for himself
      self.approved = true
    else
      if self.recipient.friends.include?(self.poster) # check if poster is in user's friend list
        if !self.recipient.permissions.find_by_friend_id(self.poster.id).ban # check if poster not in banlist
          self.approved = true
        else # poster in banlist
          self.errors.add(:ban, "You are not allowed to send #{self.recipient.first_name} any Jotty.")
          throw(:abort)
        end
      else
        if self.recipient.own_posts.where(poster: self.poster).count > 0 # check if user has any Jotty from poster before
          self.errors.add(:ban, "#{self.recipient.first_name} hasn't accepted your first Jotty!")
          throw(:abort)
        elsif self.poster.own_posts.where(poster: self.recipient).count > 0 #check if user has any unaceepted Jotty from recipient
          self.errors.add(:ban, "You have to accept #{self.recipient.first_name}'s Jotty first!")
          throw(:abort)
        else
          self.approved = false
        end
      end
    end
  end

  def new_jotty_notifications
    if self.approved
      if self.recipient.setuppush
        self.new_push
      end
      if self.recipient.setuptelegram
        self.new_telegram
      end
    end
  end

  def create_reminders
    if self.approved
      if self.recipient.setuppush
        @job = self.delay(:run_at => alarm).alarm_push
        self.update_column(:job_id, @job.id)
      end
      if self.recipient.setuptelegram
        @job = self.delay(:run_at => alarm).alarm_telegram
        self.update_column(:job_id_telegram, @job.id)
      end
    end
  end

  def update_reminders
    if job_id
      Delayed::Job.find_by_id(job_id)&.destroy
      @job = self.delay(:run_at => alarm).alarm_push
      self.update_column(:job_id, @job.id)
    end
    if job_id_telegram
      Delayed::Job.find_by_id(job_id_telegram)&.destroy
      @job = self.delay(:run_at => alarm).alarm_telegram
      self.update_column(:job_id_telegram, @job.id)
    end
  end

  def destroy_reminders
    Delayed::Job.find_by_id(job_id)&.destroy
  end

  def alarm_push
    @endpoint = recipient.endpoint
    @p256dh = recipient.p256dh
    @auth = recipient.auth
    @message = {
      title: poster.first_name + " " + poster.last_name,
      body: body,
      data: {
        url: Rails.application.routes.url_helpers.posts_url
      }
    }
    Webpush.payload_send(
      message: JSON.generate(@message),
      endpoint: @endpoint,
      p256dh: @p256dh,
      auth: @auth,
      ttl: 60,
      vapid: {
        subject: 'Jotty Reminder',
        public_key:'BEml3OHtzGWsySwKW-Xk2JFMr3kQtHYABXIvF8KH2mdqNQVu5mmQ3CYO1eBCj6jcBn4og9TDQOfd_dLbhlCpiro',
        private_key: 'Ygcz7o3MbR9GljZF4etk772JfFJU2cw0TAKaDz61h0E',
        expiration: 24 * 60 * 60
      }
    )
  end

  def alarm_telegram
    @chat_id = self.recipient.chat_id
    @parse_mode = 'html'
    @date = "*#{date.in_time_zone("Asia/Singapore").strftime("%e %b %Y %l:%M%P")}*"
    @body = body
    @poster = self.poster.first_name + ' ' + self.poster.last_name
    @url = "[Go to Jotty](https://try-jotty.herokuapp.com)"
    @text = "#{@date}\n\n#{@body}\n\n#{@poster}\n\n#{@url}"
    @bottoken = Rails.application.credentials.tele_token
    uri = URI("https://api.telegram.org/bot#{@bottoken}/sendMessage")
    res = Net::HTTP.post_form(uri, 'chat_id' => @chat_id, 'text' => @text, 'parse_mode' => 'markdown')
  end

  def new_push
    @endpoint = recipient.endpoint
    @p256dh = recipient.p256dh
    @auth = recipient.auth
    @message = {
      title: "New Jotty from " + poster.first_name + " " + poster.last_name,
      body: body,
      data: {
        url: Rails.application.routes.url_helpers.posts_url
      }
    }
    Webpush.payload_send(
      message: JSON.generate(@message),
      endpoint: @endpoint,
      p256dh: @p256dh,
      auth: @auth,
      ttl: 60,
      vapid: {
        subject: 'Jotty Reminder',
        public_key:'BEml3OHtzGWsySwKW-Xk2JFMr3kQtHYABXIvF8KH2mdqNQVu5mmQ3CYO1eBCj6jcBn4og9TDQOfd_dLbhlCpiro',
        private_key: 'Ygcz7o3MbR9GljZF4etk772JfFJU2cw0TAKaDz61h0E',
        expiration: 24 * 60 * 60
      }
    )
  end

  def new_telegram
    @chat_id = self.recipient.chat_id
    @parse_mode = 'html'
    @date = "*#{date.in_time_zone("Asia/Singapore").strftime("%e %b %Y %l:%M%P")}*"
    @body = body
    @poster = self.poster.first_name + ' ' + self.poster.last_name
    @url = "[Go to Jotty](https://try-jotty.herokuapp.com)"
    @text = "New Jotty\n\n#{@date}\n\n#{@body}\n\n#{@poster}\n\n#{@url}"
    @bottoken = Rails.application.credentials.tele_token
    uri = URI("https://api.telegram.org/bot#{@bottoken}/sendMessage")
    res = Net::HTTP.post_form(uri, 'chat_id' => @chat_id, 'text' => @text, 'parse_mode' => 'markdown')
  end

  def accepted
    self.update_attribute(:approved, true)
  end

  def new_first_jotty_notification
    if self.recipient.setuppush
      self.new_first_push
    end
    if self.recipient.setuptelegram
      self.new_first_telegram
    end
  end

  def new_first_push
    @endpoint = recipient.endpoint
    @p256dh = recipient.p256dh
    @auth = recipient.auth
    @message = {
      title: "You have a new pending Jotty from " + poster.first_name + " " + poster.last_name,
      body: body,
      data: {
        url: Rails.application.routes.url_helpers.posts_url
      }
    }
    Webpush.payload_send(
      message: JSON.generate(@message),
      endpoint: @endpoint,
      p256dh: @p256dh,
      auth: @auth,
      ttl: 60,
      vapid: {
        subject: 'New Jotty',
        public_key:'BEml3OHtzGWsySwKW-Xk2JFMr3kQtHYABXIvF8KH2mdqNQVu5mmQ3CYO1eBCj6jcBn4og9TDQOfd_dLbhlCpiro',
        private_key: 'Ygcz7o3MbR9GljZF4etk772JfFJU2cw0TAKaDz61h0E',
        expiration: 24 * 60 * 60
      }
    )
  end

  def new_first_telegram
    @chat_id = self.recipient.chat_id
    @parse_mode = 'html'
    @date = "*#{date.in_time_zone("Asia/Singapore").strftime("%e %b %Y %l:%M%P")}*"
    @body = body
    @poster = self.poster.first_name + ' ' + self.poster.last_name
    @url = "[Go to Jotty](https://try-jotty.herokuapp.com)"
    @text = "You have a new pending Jotty\n\n#{@date}\n\n#{@body}\n\n#{@poster}\n\n#{@url}"
    @bottoken = Rails.application.credentials.tele_token
    uri = URI("https://api.telegram.org/bot#{@bottoken}/sendMessage")
    res = Net::HTTP.post_form(uri, 'chat_id' => @chat_id, 'text' => @text, 'parse_mode' => 'markdown')
  end

  handle_asynchronously :new_push
  handle_asynchronously :new_telegram
  handle_asynchronously :new_first_push
  handle_asynchronously :new_first_telegram
end
