class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :rememberable
  validates :contact_number, uniqueness: true
  has_many :own_posts, foreign_key: :recipient_id, class_name: 'Post'
  has_many :other_posts, foreign_key: :poster_id, class_name: 'Post'
  has_many :permissions
  has_many :friends, through: :permissions

  def email_required?
    false
  end
end
