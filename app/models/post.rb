require "net/http"
require "uri"

class Post < ApplicationRecord
  belongs_to :poster, :foreign_key => :poster_id, class_name: "User"
  belongs_to :recipient, :foreign_key => :recipient_id, class_name: "User"
  #after_create :alarm_create, if: -> {alarm.present?}
  #after_update :alarm_changes, if: -> {saved_change_to_alarm? || saved_change_to_body? || saved_change_to_date?}
  #before_destroy :alarm_destroy, if: -> {alarm.present?}

  after_create :create_reminders, if: -> {alarm.present?}
  after_update :update_reminders, if: -> {saved_change_to_alarm?}
  before_destroy :destroy_reminders

  def create_reminders
    @job = self.delay(:run_at => alarm).alarm_push
    self.update_column(:job_id, @job.id)
  end

  def update_reminders
    Delayed::Job.find_by_id(job_id)&.destroy
    @job = self.delay(:run_at => alarm).alarm_push
    self.update_column(:job_id, @job.id)
  end

  def destroy_reminders
    Delayed::Job.find_by_id(job_id)&.destroy
  end

  def alarm_push
    @endpoint = poster.endpoint
    @p256dh = poster.p256dh
    @auth = poster.auth
    @message = {
      title: poster.first_name + " " + poster.last_name,
      body: body,
      data: {
        url: 'http://localhost:3000'
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

end
