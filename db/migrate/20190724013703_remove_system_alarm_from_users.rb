class RemoveSystemAlarmFromUsers < ActiveRecord::Migration[5.2]
  def change
    remove_column :posts, :system_alarm
  end
end
