class ItemsController < ApplicationController
  attr_accessor :items, :item
  helper_method :items, :item

  before_action { self.items = Item.all.order(created_at: :desc) }
  before_action(except: %i[index create]) { self.item = items.find(params[:id]) }

  def index
  end

  def create
    item = items.create!(item_params)
    if request.headers["App-Content-Type"] == "partial"
      render_partial("items/item", item:)
    else
      redirect_to root_path
    end
  end

  def update
    success = item.update(item_params)

    if request.headers["App-Content-Type"] == "partial"
      render_partial("items/item", status: success ? :ok : :unprocessable_entity)
    else
      redirect_to root_path
    end
  end

  def destroy
    item.destroy!

    if request.headers["App-Content-Type"] == "partial"
      head :ok
    else
      redirect_to root_path
    end
  end

  private

  def item_params
    params.require(:item).permit(:content, :done)
  end

  def render_partial(path, status: :ok, **locals)
    render plain: render_to_string(partial: path, layout: false, locals: locals), status: status
  end
end
