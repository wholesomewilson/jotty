Permission < ApplicationRecord
  belongs_to :user
  belongs_to :friend, :class_name => 'User'

  after_create :new_friend_notifications, if: -> {!ban}

  def new_friend_notifications
    if self.friend.setuppush
      self.new_friend_push
    end
    if self.friend.setuptelegram
      self.new_friend_telegram
    end
  end

  def new_friend_push
    @endpoint = friend.endpoint
    @p256dh = friend.p256dh
    @auth = friend.auth
    @message = {
      title: "Yay! " + friend.first_name + " is your new friend in Jotty!",
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

  def new_friend_telegram
    @chat_id = self.friend.chat_id
    @parse_mode = 'html'
    @date = "*#{date.in_time_zone("Asia/Singapore").strftime("%e %b %Y %l:%M%P")}*"
    @body = body
    @poster = self.poster.first_name
    @url = "[Go to Jotty](https://try-jotty.herokuapp.com)"
    @text = "Yay! #{@poster} is your new friend in Jotty!\n\n#{@url}"
    @bottoken = Rails.application.credentials.tele_token
    uri = URI("https://api.telegram.org/bot#{@bottoken}/sendMessage")
    res = Net::HTTP.post_form(uri, 'chat_id' => @chat_id, 'text' => @text, 'parse_mode' => 'markdown')
  end

  handle_asynchronously :new_friend_push
  handle_asynchronously :new_friend_telegram
end
