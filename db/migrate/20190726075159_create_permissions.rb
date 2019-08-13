class CreatePermissions < ActiveRecord::Migration[5.2]
  def change
    create_table :permissions do |t|
      t.belongs_to :user
      t.belongs_to :friend, class: 'User'
      t.timestamps
    end
  end
end
