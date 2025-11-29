<?php
// tests/Feature/Auth/PasswordResetTest.php

use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\ResetPassword;
use App\Models\User;

test('reset password link can be requested', function () {
    $this->asGuest();

    Notification::fake();

    $user = User::factory()->create([
        'tenant_id' => $this->tenant->id,
    ]);

    $response = $this->post('/forgot-password', [
        'email' => $user->email,
    ]);



    $response->assertStatus(200);

    Notification::assertSentTo($user, ResetPassword::class);
});
