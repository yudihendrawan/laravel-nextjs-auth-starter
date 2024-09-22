<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use App\Models\Role;
use App\Traits\HasUuid;
use Attribute;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\Permission\Traits\HasRoles;

// use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements MustVerifyEmail
// class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, HasUuid;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'uuid',
        'password',
        'role',
        'status',
        'gauth_id',
        'gauth_type',
        // 'store_id' => 'required_if:role,merchant',
        'phone_number',
        'address',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function isActive()
    {
        return $this->status === 'active';
    }
    public function isInactive()
    {
        return $this->status === 'inactive';
    }
    public function isSuspended()
    {
        return $this->status === 'suspended';
    }



    /**
     * The roles that belong to the user.
     */
    // public function roles()
    // {
    //     return $this->belongsToMany(Role::class);
    // }

    /**
     * Check if the user has a role.
     */
    // public function hasRole($role)
    // {
    //     if (is_string($role)) {
    //         return $this->roles()->where('name', $role)->exists();
    //     }

    //     return $this->roles()->whereIn('name', $role)->exists();
    // }
}
