<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'code' => $this->faker->unique()->bothify('BRND-#####'),
            'name' => $this->faker->company(),
            'text' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'brandable' => $this->faker->randomElement(['car', 'motorcycle', 'bicycle']),
            'is_active' => $this->faker->boolean(),
        ];
    }
}
