<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Password;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{


    public function boot()
    {
        $this->registerPolicies();

        // Passport::loadKeysFrom(__DIR__.'/../secrets/oauth');
        Passport::loadKeysFrom(storage_path('/app'));
        Passport::tokensExpireIn(now()->addDays(15));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));
        Passport::hashClientSecrets();
        Passport::enablePasswordGrant();
    }
}
