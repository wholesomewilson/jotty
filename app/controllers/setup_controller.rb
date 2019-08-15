class SetupController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:teleupdates]

  def index

  end

  def teleupdates
    @chat_id = params['message']['chat']['id'].to_s
    @t_token = params['message']['text'].to_s
    puts @chat_id
    puts @t_token.slice!(7,16)
    #@user = User.find_by_t_token(@t_token)
    #@user.update_attribute(:chat_id, @chat_id)
    render body: nil
  end
end
