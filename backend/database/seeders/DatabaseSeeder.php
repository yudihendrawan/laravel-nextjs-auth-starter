<?php

namespace Database\Seeders;

use App\Models\CarDetail;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\ProductType;
use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::factory(25)->create();
        Coupon::factory(10)->create();

        ProductType::factory(10)->create();

        User::role('merchant')->get()->each(function ($user) {
            Tenant::factory(10)->create([
                'owner_id' => $user->id
            ])->each(function ($tenant) {
                Product::factory(50)->create([
                    'tenant_id' => $tenant->id,
                ])->each(function ($product) {
                    Coupon::factory(10)->create();
                    Category::factory(10)->create();
                    CarDetail::factory(50)->create([
                        'product_id' => $product->id,
                    ]);
                });
            });
        });


        User::role('customer')->get()->each(function ($user) {
            Order::factory(10)->create([
                'user_id' => $user->id
            ])->each(function ($order) {
                $products = Product::inRandomOrder()->limit(10)->get();

                $products->each(function ($product) use ($order) {
                    OrderItem::factory(50)->create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                    ]);
                });
            });
        });
    }
}
