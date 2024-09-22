<?php

namespace Database\Factories;

use App\Models\PaymentMethod;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => $this->faker->uuid(),
            'user_id' => User::factory(), // Menggunakan factory untuk user
            'tenant_id' => Tenant::factory(), // Menggunakan factory untuk tenant
            'total_price' => $this->faker->randomFloat(2, 100, 10000), // Harga total acak
            'payment_id' => PaymentMethod::factory(), // Menggunakan factory untuk metode pembayaran
            'status' => $this->faker->randomElement(['pending', 'paid', 'shipped', 'delivered', 'cancelled']), // Status acak
        ];
    }
}
