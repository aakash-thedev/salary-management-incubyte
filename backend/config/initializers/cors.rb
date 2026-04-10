# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

allowed_origins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://salary-management-incubyte.vercel.app",
  ENV["FRONTEND_URL"]
].compact.uniq

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
