#!/bin/bash

# Step 1: Composer install without dev dependencies and optimize autoloader
echo "Running composer install --no-dev and optimize..."
composer install --no-dev --optimize-autoloader

sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Step 2: Clear Laravel cache
echo "Clearing Laravel cache..."
php artisan cache:clear

# Step 3: Cache Laravel routes, config, and views
echo "Caching Laravel routes, config, and views..."
php artisan route:cache
php artisan config:cache
php artisan view:cache

# Step 4: Run npm build for the frontend code
echo "Running npm run build..."
npm install # Ensure all npm dependencies are installed
npm run build

# Step 5: Run Laravel tests
echo "Running Laravel tests..."
php artisan test

# Optional: Any additional steps
# echo "Additional steps..."
php artisan migrate --force
php artisan db:seed --force

# php artisan queue:work --daemon


