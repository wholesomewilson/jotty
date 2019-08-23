class AddJobIdTelegramToPost < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :job_id_telegram, :integer
  end
end
