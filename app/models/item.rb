class Item < ApplicationRecord
  validates :content, presence: true
end
