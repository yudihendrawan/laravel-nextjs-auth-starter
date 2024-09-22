<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => (string) Str::uuid(), // UUID yang unik untuk setiap category
            'code' => strtoupper($this->faker->unique()->lexify('CAT???')), // Kode unik untuk kategori, seperti 'CAT001'
            'name' => $this->faker->word(), // Nama kategori, misalnya 'Electronics', 'Cars', dll.
            'description' => $this->faker->sentence(), // Deskripsi singkat untuk kategori
            'url' => $this->faker->url(), // URL yang terkait dengan kategori, biasanya halaman web terkait
            'meta_title' => $this->faker->sentence(3), // Meta title untuk SEO, seperti 'Best Electronics'
            'meta_keywords' => implode(',', $this->faker->words(5)), // Meta keywords untuk SEO, misalnya 'electronics, gadgets'
            'categorizable' => $this->faker->word(), // Kolom yang menyimpan tipe model yang berelasi, biasanya untuk polymorphic
            'is_active' => $this->faker->boolean(), // Status aktif/tidak dari kategori
        ];
    }
}
