class ItemsController < ApplicationController
  attr_accessor :items
  helper_method :items

  before_action { self.items = Item.all.order(created_at: :desc) }

  def index
  end

  def create
    items.create!(item_params)
    redirect_to root_path
  end

  private

  def item_params
    params.require(:item).permit(:content, :done)
  end
end
