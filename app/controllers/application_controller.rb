class ApplicationController < ActionController::Base
  #protect_from_forgery with: :null_session
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected
  def configure_permitted_parameters
   devise_parameter_sanitizer.permit(:sign_up, keys: [:contact_number, :first_name, :last_name])
   devise_parameter_sanitizer.permit(:sign_in, keys: [:contact_number])
   devise_parameter_sanitizer.permit(:account_update, keys: [:contact_number, :auth, :endpoint, :p256dh, :setup, :setuptelegram, :setuppush])
  end


end
