#!/bin/bash

echo "Running composer install --no-dev and optimize..."
composer install --no-dev --optimize-autoloader

echo "Move Files Uploaded From Github Actions"
sudo rm -rf ./public/build
sudo mv /home/runner/scp/build ./public/build

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


