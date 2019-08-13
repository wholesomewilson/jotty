class AddTimezoneOffsetToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :timezone_offset, :integer
  end
end
