<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenant>
 */
class TenantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => $this->faker->uuid,
            'name' => $this->faker->company,
            'owner_id' => User::factory(),
            'address' => $this->faker->address,
            'phone_number' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'banner' => $this->faker->imageUrl(),
            'brochure' => $this->faker->imageUrl(),
            'is_active' => $this->faker->boolean,
            'confirm' => $this->faker->boolean,
            'description' => $this->faker->paragraph,
            'url' => $this->faker->url,
        ];
    }
}
