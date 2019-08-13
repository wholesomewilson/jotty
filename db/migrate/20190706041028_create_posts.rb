class CreatePosts < ActiveRecord::Migration[5.2]
  def change
    create_table :posts do |t|
      t.datetime :date
      t.datetime :alarm
      t.text :body
      t.string :status

      t.timestamps
    end
  end
end
