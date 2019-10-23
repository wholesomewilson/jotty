class Api::SearchusersController < ApplicationController
  before_action :authenticate_user!
  respond_to :json
  def index
    @user = User.find_by_contact_number(params[:contact_number])
    respond_with(@user, :except => remove_attr_user)
  end

  def show
    @user = User.find(params[:id])
    respond_with(@user, :except => remove_attr_user)
  end

  private
  def remove_attr_user
    [:created_at, :email, :updated_at, :contact_number, :auth, :chat_id, :endpoint, :p256dh, :setup, :setuppush, :setuptelegram, :t_token]
  end
end
