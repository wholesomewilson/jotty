class AddJobIdToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :job_id, :integer
  end
end
