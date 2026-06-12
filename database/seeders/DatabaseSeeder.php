<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\Demo\DemoAkinomassSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            DemoAkinomassSeeder::class,
        ]);
    }
}
