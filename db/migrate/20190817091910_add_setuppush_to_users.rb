class AddSetuppushToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :setuppush, :boolean, null: false, default: false
  end
end
