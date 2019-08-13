class Api::CurrentusersController < ApplicationController
  before_action :authenticate_user!
  respond_to :json
  def index
    @current_user = current_user
    respond_with(@current_user, :except => remove_attr_user)
  end

  private
  def remove_attr_user
    [:auth, :endpoint, :p256dh, :created_at, :email, :updated_at]
  end
end
