# CarDB - Laravel

Welcome to CarDB, a simple web application project featuring modern UI framework (React) and API backend (Laravel).

## Introduction

This is a sub-project of [CarDB](github.com/raygone/CarDB). This project highlights a full-stack web application developed using Laravel for the back-end and InertiaJS with React and TailwindCSS for the front-end.

## Features

- **[React](./resources) UI:** A dynamic user interface built using @InertiaJS/React with Typescript and Styled with TailwindCSS.
- **Laravel:** Robust API with Laravel Sanctum authentication using PostgreSQL database.

## Setup

To run this project locally, follow these steps:

### Prerequisites

- Node.js and npm
- PHP and composer

```sh
## To run locally
#### Install dependencies
composer install # PHP
npm install # node.js

npm run dev
php artisan serve
#### or
cd ./public
php -S localhost:8000 # to run locally

##===============================
## To run in Production
composer install --no-dev # PHP
npm install # node.js
#### In .env set
APP_ENV=production
APP_DEBUG=false

### Then make front-end build
npm run build
## configure apache2 and set
DocumentRoot <path-to-project>/public 
```

## Demo
You can check the demo at this URL: [laracar.sushmaregan.com](https://laracar.sushmaregan.com)

> Don't want to register? use this credentials <br>
- Email: demo@noemail.com<br>
- Pass: P@55word
 
