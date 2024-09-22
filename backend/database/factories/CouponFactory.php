<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(Str::random(10)),
            'couponable_type' => 'App\Models\Product', // atau model lain yang relevan
            'couponable_id' => Product::factory(),
            'discount_amount' => $this->faker->randomFloat(2, 5, 100), // Random discount amount between 5 and 100
            'discount_percentage' => $this->faker->randomFloat(2, 5, 50), // Random discount percentage between 5% and 50%
            'expiry_date' => $this->faker->dateTimeBetween('now', '+1 year'), // Expiry date between now and one year from now
        ];
    }
}
