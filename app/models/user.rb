class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :rememberable
  validates :contact_number, uniqueness: true
  has_many :own_posts, foreign_key: :recipient_id, class_name: 'Post'
  has_many :other_posts, foreign_key: :poster_id, class_name: 'Post'
  has_many :permissions
  has_many :friends, through: :permissions
  after_create :generate_t_token
  after_update :send_welcome_tele, if: -> {saved_change_to_chat_id?}
  after_update :send_welcome_push, if: -> {saved_change_to_endpoint?}

  def email_required?
    false
  end

  def generate_t_token
    @t_token = SecureRandom.alphanumeric
    self.update_column(:t_token, @t_token)
  end

  def send_welcome_tele
    @text = 'Setup for Jotty Notification Complete!'
    @bottoken = Rails.application.credentials.tele_token
    uri = URI("https://api.telegram.org/bot#{@bottoken}/sendMessage")
    res = Net::HTTP.post_form(uri, 'chat_id' => chat_id, 'text' => @text)
    self.update_column(:setuptelegram, true)
  end

  def send_welcome_push
    @message = {
      title: "It's a success!",
      body: 'Setup for Jotty Notification Complete!',
      data: {
        url: Rails.application.routes.url_helpers.posts_url
      }
    }
    Webpush.payload_send(
      message: JSON.generate(@message),
      endpoint: endpoint,
      p256dh: p256dh,
      auth: auth,
      ttl: 60,
      vapid: {
        subject: 'Jotty Reminder',
        public_key:'BEml3OHtzGWsySwKW-Xk2JFMr3kQtHYABXIvF8KH2mdqNQVu5mmQ3CYO1eBCj6jcBn4og9TDQOfd_dLbhlCpiro',
        private_key: 'Ygcz7o3MbR9GljZF4etk772JfFJU2cw0TAKaDz61h0E',
        expiration: 24 * 60 * 60
      }
    )
  end

  def remember_me
    (super == nil) ? '1' : super
  end


  handle_asynchronously :send_welcome_tele
end
