<?php

namespace App\Providers;

use App\Http\Controllers\LoginController;
use App\Http\Service\LoginService;
use Illuminate\Support\ServiceProvider;

class BaseServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton("App\Http\Controller\LoginController", function ($app) {
            return new LoginController($app->make('LoginService'));
        });
    }
}
