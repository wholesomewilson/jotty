class AddApprovedToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :approved, :boolean
  end
end
