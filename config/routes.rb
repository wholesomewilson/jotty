Rails.application.routes.draw do
  root to: redirect('/posts')
  #
  authenticated :user do
    root to: redirect('/posts')
  end

  get '/posts', to: 'site#index'
  get 'posts/new', to: 'site#index'
  get 'posts/:id', to: 'site#index'
  get 'posts/:id/edit', to: 'site#index'
  get 'setup', to: 'setup#index'
  post 'teleupdates', to: 'setup#teleupdates'
  #mount ActionCable.server => '/cable'

  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }

  namespace :api do
    resources :posts, only: %i[show create destroy update]
    resources :searchusers, only: %i[index]
    resources :currentusers, only: %i[index]
    get 'alarm', to: 'posts#alarm'
    get 'getownposts', to: 'posts#get_own_posts'
    get 'getotherposts', to: 'posts#get_other_posts'
  end

  get '/service_worker.js' => "serviceworker#service_worker"
  get '/manifest.json' => "serviceworker#manifest"

end
