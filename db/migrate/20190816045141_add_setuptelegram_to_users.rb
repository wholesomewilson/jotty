class AddSetuptelegramToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :setuptelegram, :boolean, null: false, default: false
  end
end
