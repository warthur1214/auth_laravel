
command:
	create project:
		composer create-project --prefer-dist laravel/laravel auth_laravel "5.4.*"
	clear cache:
		php artisan cache:clear
	first update:
	    composer update --no-scripts
	key generate:
	    php artisan key:generate
	ide-helper:generate
	    php artisan ide-helper:generate
	.phpstorm.meta file
	    php artisan ide-helper:meta