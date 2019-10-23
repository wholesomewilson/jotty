class Api::PermissionsController < ApplicationController
  respond_to :json
  def create
    @post = Post.find(params[:post_id])
    @friend = @post.poster
    @permission = current_user.permissions.create(friend: @friend, ban: false)
    @inverse_permission = @friend.permissions.create(friend: current_user, ban: false)
    @post.accepted
    render body: nil
  end

  def index
    @permissions = current_user.permissions.order("ban ASC, created_at DESC")
    respond_with(@permissions, :include => add_attr_permission, :except => remove_attr_permission)
  end

  def update
    @permission = Permission.find(params[:id])
    @permission.update(ban: params[:ban])
    if !params[:ban]
      if @permission.friend.permissions.find_by_friend_id(current_user.id)
        @permission.friend.permissions.find_by_friend_id(current_user.id).update(ban: params[:ban])
      else
        @friend = @permission.friend
        @inverse_permission = @friend.permissions.create(friend: current_user, ban: params[:ban])
      end
    end
    #respond_with(@permission, :include => add_attr_permission, :except => remove_attr_permission)
    render body: nil
  end

  private
  def remove_attr_post
    [:poster_id, :status, :updated_at]
  end

  def add_attr_post
    { :poster => {:only => [:first_name, :last_name] }, :recipient => {:only => [:first_name, :last_name] } }
  end

  def remove_attr_permission
    [:updated_at]
  end

  def add_attr_permission
    { :friend => {:only => [:first_name, :last_name]} }
  end

end
