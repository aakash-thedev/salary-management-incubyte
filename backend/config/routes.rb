Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :employees, only: [:index, :show, :create, :update, :destroy]
      get "insights", to: "insights#index"
    end
  end
end
