class Api::SuggestedusersController < ApplicationController
  before_action :authenticate_user!
  respond_to :json
  def index
    # find recipients with the highest count of user other_posts
    @user_ids = current_user.other_posts.where.not(recipient: current_user).group(:recipient_id).count.sort_by {|k,v| v}.to_h.keys.last(3)
    @users = User.where(id: @user_ids)
    respond_with(@users, :except => remove_attr_user)
  end

  private
  def remove_attr_user
    [:created_at, :email, :updated_at, :contact_number, :auth, :chat_id, :endpoint, :p256dh, :setup, :setuppush, :setuptelegram, :t_token]
  end
end
