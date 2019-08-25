class Api::PostsController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token
  #protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json' }
  respond_to :json

  def get_own_posts
    @own_posts = current_user.own_posts.order(date: :DESC)
    respond_with(@own_posts, :include => add_attr_post, :except => remove_attr_post)
  end

  def get_other_posts
    @other_posts = current_user.other_posts.where.not(recipient: current_user).order(date: :DESC)
    respond_with(@other_posts, :include => add_attr_post, :except => remove_attr_post)
  end

  def show
    respond_with Post.find(params[:id])
  end

  def create
    @recipient = User.find(params[:post][:recipient_id])
    if @recipient == current_user
      @post = current_user.own_posts.create(post_params.merge(poster: current_user))
      respond_with(:api, @post, :include => add_attr_post, :except => remove_attr_post)
    else
      if @recipient.friends.include? current_user
        @post = @recipient.own_posts.create(post_params.merge(poster: current_user))
        respond_with(:api, @post, :include => add_attr_post, :except => remove_attr_post)
      else
        
      end
    end
  end

  def destroy
    respond_with Post.destroy(params[:id])
  end

  def update
    @post = Post.find(params[:id])
    @post.update(post_params)
    respond_with Post, json: @post
  end

  def alarm
    Post.first.alarm_actions
    render body: nil
  end

  private

  def post_params
    params.require(:post).permit(:id, :date, :alarm, :body, :timezone_offset, :recipient_id, :status, :created_at, :updated_at)
  end

  def remove_attr_post
    [:poster_id, :status, :updated_at]
  end

  def add_attr_post
    { :poster => {:only => [:first_name, :last_name] }, :recipient => {:only => [:first_name, :last_name] } }
  end

end
