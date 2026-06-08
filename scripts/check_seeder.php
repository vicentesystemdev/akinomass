<?php
$root = dirname(__DIR__);
require $root . '/vendor/autoload.php';
$app = require $root . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$class = 'Database\\Seeders\\Demo\\DemoAkinomassSeeder';
echo "class_exists: ";
var_dump(class_exists($class));
try {
  $s = $app->make($class);
  echo "made ok\n";
} catch (Throwable $e) {
  echo "make error: " . $e->getMessage() . "\n";
}
