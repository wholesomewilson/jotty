class SetupController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:teleupdates]

  def index

  end

  def teleupdates
    puts params[:chat][:id]
    puts params[:text]
    @t_token = params
    render body: nil
  end
end
