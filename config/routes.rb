Rails.application.routes.draw do
  get '/home', to: 'home#index'
  get 'permissions/create'
  get 'permissions/destroy'
  root to: redirect('/home')

  authenticated :user do
    root to: redirect('/posts')
  end

  get '/posts', to: 'site#index'
  get 'posts/new', to: 'site#index'
  get 'posts/:id', to: 'site#index'
  get 'posts/:id/edit', to: 'site#index'
  get 'setup', to: 'setup#index'
  post 'teleupdates', to: 'setup#teleupdates'

  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }

  namespace :api do
    resources :posts, only: %i[show create destroy update]
    resources :permissions, only: %i[index create destroy update]
    resources :searchusers, only: %i[index show]
    resources :suggestedusers, only: %i[index]
    resources :currentusers, only: %i[index]
    get 'alarm', to: 'posts#alarm'
    get 'getownposts', to: 'posts#get_own_posts'
    get 'getotherposts', to: 'posts#get_other_posts'
    get 'pending_posts', to: 'posts#pending_posts'
  end

  get '/service_worker.js' => "serviceworker#service_worker"
  get '/manifest.json' => "serviceworker#manifest"

end
