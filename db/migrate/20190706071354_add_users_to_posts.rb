class AddUsersToPosts < ActiveRecord::Migration[5.2]
  def change
    add_reference :posts, :recipient, foreign_key: true
    add_reference :posts, :poster, foreign_key: true
  end
end
