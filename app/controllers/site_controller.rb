class SiteController < ApplicationController
  #before_action :setup_yet?
  before_action :authenticate_user!
  def index
    if !user_signed_in?
      redirect_to new_user_session_path
    end
  end

  private
  def setup_yet?
    redirect_to setup_path if !current_user.setup
  end
end
