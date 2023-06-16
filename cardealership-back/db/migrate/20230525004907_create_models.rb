class CreateModels < ActiveRecord::Migration[7.0]
  def change
    create_table :models do |t|
      t.references :brand, null: false, foreign_key: true
      t.string :name
      t.integer :year
      t.string :transmission
      t.integer :passenger_cap

      t.timestamps
    end
  end
end
