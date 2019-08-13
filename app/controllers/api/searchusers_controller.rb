class Api::SearchusersController < ApplicationController
  before_action :authenticate_user!
  respond_to :json
  def index
    @user = User.find_by_contact_number(params[:contact_number])
    respond_with(@user, :except => remove_attr_user)
  end

  private
  def remove_attr_user
    [:created_at, :email, :updated_at, :contact_number]
  end
end
