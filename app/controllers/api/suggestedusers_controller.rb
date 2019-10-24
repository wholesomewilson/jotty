class Api::SuggestedusersController < ApplicationController
  before_action :authenticate_user!
  respond_to :json
  def index
    @user_ids = current_user.friends.map { |f| f.own_posts.where(poster: current_user).group(:recipient_id).count }.sort_by {|k,v| v}.last(3).map { |h| h.keys[0] }
    if @user_ids.length < 3
      @friends = current_user.friends.last(3).map { |x| x.id }
      @numFriends = 3 - @user_ids.length
      @user_ids << @friends.pop(@numFriends)
    end
    @users = User.where(id: @user_ids)

    respond_with(@users, :except => remove_attr_user)
  end

  private
  def remove_attr_user
    [:created_at, :email, :updated_at, :contact_number, :auth, :chat_id, :endpoint, :p256dh, :setup, :setuppush, :setuptelegram, :t_token]
  end
end
