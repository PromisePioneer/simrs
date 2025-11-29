<?php
// tests/Feature/Auth/RegistrationTest.php

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test UserManagement',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect();
});
