Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :employees, only: [:index, :show, :create, :update, :destroy] do
        collection do
          get :countries
          get :job_titles
        end
      end
      get "insights", to: "insights#index"
    end
  end
end
