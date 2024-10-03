Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  resources :items, only: %i[index create]

  # Defines the root path route ("/")
  root "items#index"
end
