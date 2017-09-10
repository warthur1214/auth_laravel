<?php

namespace App\Providers;

use App\Http\Controllers\LoginController;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    // 延迟加载
    protected $defer = true;

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
        $this->app->bind(
            'App\Http\Service\LoginService',
            'App\Http\Service\Impl\LoginServiceImpl'
        );
        $this->app->singleton("App\Http\Controller\LoginController", function ($app) {

            return new LoginController($app->make('LoginService'));
        });
    }

    public function provides()
    {
        return [LoginController::class];
    }
}
