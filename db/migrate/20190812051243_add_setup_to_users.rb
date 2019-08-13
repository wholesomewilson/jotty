class AddSetupToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :setup, :boolean, null: false, default: false
  end
end
