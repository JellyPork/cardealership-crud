class Model < ApplicationRecord
  has_many :vehicle
  belongs_to :brand
end
