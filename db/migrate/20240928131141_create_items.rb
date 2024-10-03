class CreateItems < ActiveRecord::Migration[7.0]
  def change
    create_table :items do |t|
      t.text :content, null: false
      t.boolean :done, default: false, null: false

      t.timestamps
    end
  end
end
