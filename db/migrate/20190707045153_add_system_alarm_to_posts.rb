class AddSystemAlarmToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :system_alarm, :datetime
  end
end
