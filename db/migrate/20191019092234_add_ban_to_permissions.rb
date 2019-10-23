class AddBanToPermissions < ActiveRecord::Migration[5.2]
  def change
    add_column :permissions, :ban, :boolean
  end
end
