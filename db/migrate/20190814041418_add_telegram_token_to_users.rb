class AddTelegramTokenToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :t_token, :string
  end
end
