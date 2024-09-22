<?php

namespace Database\Factories;

use App\Models\ProductType;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
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
            'code' => strtoupper(Str::random(10)),
            'name' => $this->faker->word(),
            'tenant_id' => Tenant::factory(), // Menggunakan factory untuk tenant
            'owner_id' => User::factory(), // Menggunakan factory untuk user
            'type_id' => ProductType::factory(), // Menggunakan factory untuk product type
            'price' => $this->faker->randomFloat(2, 10, 500), // Harga acak antara 10 hingga 500 dengan 2 desimal
            'color' => $this->faker->colorName(), // Warna acak
            'url' => $this->faker->url, // URL acak
            'meta_title' => $this->faker->sentence(),
            'meta_description' => $this->faker->paragraph(),
            'meta_keywords' => $this->faker->words(3, true), // Kata kunci meta acak
        ];
    }
}
