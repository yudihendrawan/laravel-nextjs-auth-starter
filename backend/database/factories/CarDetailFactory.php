<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarDetail>
 */
class CarDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'engine_tipe' => $this->faker->randomElement(['V6', 'V8', 'Inline-4', 'Electric', 'Hybrid']),
            'mileage' => $this->faker->numberBetween(0, 200000),
            'transmission' => $this->faker->randomElement(['Manual', 'Automatic', 'CVT', 'Semi-Automatic']),
            'fuel_type' => $this->faker->randomElement(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
            'seat_count' => $this->faker->numberBetween(2, 8),
            'registration_number' => strtoupper($this->faker->bothify('??###??')),
            'registration_date' => $this->faker->date(),
            'vin_number' => strtoupper($this->faker->bothify('#################')),
        ];
    }
}
