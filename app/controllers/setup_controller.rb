class SetupController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:teleupdates]

  def index

  end

  def teleupdates
    puts params
  end
end
