<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(), // Menggunakan factory untuk order
            'product_id' => Product::factory(), // Menggunakan factory untuk product
            'quantity' => $this->faker->numberBetween(1, 10), // Kuantitas acak antara 1 hingga 10
            'price' => $this->faker->randomFloat(2, 10, 500), // Harga acak antara 10 hingga 500 dengan 2 desimal
        ];
    }
}
