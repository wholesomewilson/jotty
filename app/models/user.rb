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

  def email_required?
    false
  end

  def generate_t_token
    @t_token = SecureRandom.alphanumeric
    self.update_column(:t_token, @t_token)
  end

  def send_welcome_tele
    @text = 'Setup for Jotty Notification Complete!'
    @botname = Rails.application.credentials.tele_token
    puts @text
    puts @botname
    uri = URI("https://api.telegram.org/bot#{@botname}/sendMessage")
    req = Net::HTTP::Post.new(uri)
    req.body = {
      'chat_id' => chat_id,
      'text' => @text
    }
    res = Net::HTTP.start(uri.hostname, uri.port) do |http|
      http.request(req)
    end
  end
end
