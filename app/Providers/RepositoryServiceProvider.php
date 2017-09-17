<?php

namespace App\Providers;

use App\Http\Controllers\LoginController;
use App\Http\Controllers\OrganController;
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
        $services = ['Login', 'Organ'];

        foreach ($services as $item) {
            $this->app->bind("App\Http\Service\\{$item}Service",
                "App\Http\Service\Impl\\{$item}ServiceImpl");
            $this->app->singleton("App\Http\Controller\\{$item}Controller", function ($app) use ($item) {
                return new ${"${$item}Controller"}($app->make("{$item}Service"));
            });
        }
    }

    public function provides()
    {
        return [LoginController::class, OrganController::class];
    }


}
