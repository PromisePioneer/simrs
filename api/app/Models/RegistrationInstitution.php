<?php

namespace App\Models;

use Database\Factories\RegistrationInstitutionFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistrationInstitution extends Model
{
    /** @use HasFactory<RegistrationInstitutionFactory> */
    use HasUuids, HasFactory;

    protected $table = 'registration_institutions';
    protected $fillable = [
        'name',
        'type'
    ];
}
