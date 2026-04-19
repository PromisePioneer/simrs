<?php

use App\Http\Middleware\EnsureEmailIsVerified;
use App\Http\Middleware\SetActiveRolePermissions;
use Domains\Tenant\Presentation\Middleware\CheckModuleAccess;
use Domains\Tenant\Presentation\Middleware\CheckTenantSubscription;
use Domains\Tenant\Presentation\Middleware\EnsureTenantExists;
use Domains\Tenant\Presentation\Middleware\SetActiveTenantContext;
use Domains\Tenant\Presentation\Middleware\SetTenantPermissionTeam;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
            SetTenantPermissionTeam::class,
            EnsureTenantExists::class,
            CheckTenantSubscription::class,
            SetActiveRolePermissions::class,
            SetActiveTenantContext::class,
        ]);

        $middleware->alias([
            'verified' => EnsureEmailIsVerified::class,
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'module' => CheckModuleAccess::class, // ← tambahan
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
