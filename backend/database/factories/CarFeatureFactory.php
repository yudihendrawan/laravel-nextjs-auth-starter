<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarFeature>
 */
class CarFeatureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => \App\Models\Product::factory(),
            'feature_name' => $this->faker->randomElement([
                'Air Conditioning',
                'Leather Seats',
                'Sunroof',
                'Bluetooth',
                'Backup Camera',
                'Navigation System',
                'Heated Seats',
                'Alloy Wheels',
                'Cruise Control',
                'Keyless Entry'
            ]),
        ];
    }
}
