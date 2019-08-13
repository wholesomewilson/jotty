class AddPushInfoToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :endpoint, :string
    add_column :users, :p256dh, :string
    add_column :users, :auth, :string
  end
end
