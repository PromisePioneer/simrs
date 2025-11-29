<?php
// tests/Feature/Auth/AuthenticationTest.php

use App\Models\User;

test('users can authenticate using the login screen', function () {
    $this->asGuest();

    $user = User::factory()->create([
        'tenant_id' => $this->tenant->id,
        'password' => bcrypt('password'),
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertNoContent();
});

test('users can not authenticate with invalid password', function () {
    $this->asGuest();

    $user = User::factory()->create([
        'tenant_id' => $this->tenant->id,
    ]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $response = $this->post('/logout');

    $this->assertGuest();
    $response->assertNoContent();
});
