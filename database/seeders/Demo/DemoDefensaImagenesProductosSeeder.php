<?php

namespace Database\Seeders\Demo;

use App\Models\Producto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class DemoDefensaImagenesProductosSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('==================================================');
        $this->command->info('INICIANDO GENERACIÓN DE IMÁGENES DEMO DE PRODUCTOS');
        $this->command->info('==================================================');

        $dirPublico = storage_path('app/public/demo/productos');
        File::ensureDirectoryExists($dirPublico);

        $gdDisponible = extension_loaded('gd') && function_exists('imagecreatetruecolor');
        if (!$gdDisponible) {
            $this->command->warn('La extensión GD de PHP no está disponible. Se generarán imágenes en formato SVG como fallback.');
        }

        $fontPath = 'C:\\Windows\\Fonts\\arial.ttf';
        $tieneArial = file_exists($fontPath);

        $productos = Producto::with('categoria')->get();
        $total = $productos->count();
        $this->command->info("Se procesarán {$total} productos...");

        $generadas = 0;

        foreach ($productos as $producto) {
            $slug = Str::slug($producto->nombre_pro);
            $extension = $gdDisponible ? 'png' : 'svg';
            $nombreArchivo = "{$producto->cod_producto}-{$slug}.{$extension}";
            $rutaCompleta = "{$dirPublico}/{$nombreArchivo}";
            $rutaRelativa = "demo/productos/{$nombreArchivo}";

            $categoriaNombre = $producto->categoria?->nombre_cat ?? 'General';
            $precio = 'Bs. ' . number_format($producto->precio_venta_pro, 1);

            // Obtener paleta y tipo de silueta según la categoría
            $estilo = $this->obtenerEstiloCategoria($categoriaNombre);

            if ($gdDisponible) {
                $this->generarImagenPNG($rutaCompleta, $producto->nombre_pro, $categoriaNombre, $precio, $estilo, $tieneArial ? $fontPath : null);
            } else {
                $this->generarImagenSVG($rutaCompleta, $producto->nombre_pro, $categoriaNombre, $precio, $estilo);
            }

            // Actualizar imagen_pro en base de datos
            $producto->imagen_pro = $rutaRelativa;
            $producto->save();

            $generadas++;
            if ($generadas % 10 === 0 || $generadas === $total) {
                $this->command->info("Progreso: {$generadas}/{$total} imágenes procesadas.");
            }
        }

        $this->command->info('==================================================');
        $this->command->info("¡PROCESAMIENTO COMPLETADO! {$generadas} imágenes generadas en:");
        $this->command->info("storage/app/public/demo/productos");
        $this->command->info('==================================================');
    }

    private function obtenerEstiloCategoria(string $categoria): array
    {
        $catLower = mb_strtolower($categoria);

        // Retorna: [bg_rgb, accent_rgb, shape_type, bg_hex, accent_hex]
        if (str_contains($catLower, 'jeans') || str_contains($catLower, 'pantalones')) {
            return [
                'bg_rgb' => [230, 238, 248],
                'accent_rgb' => [74, 111, 165],
                'shape' => 'pantalon',
                'bg_hex' => '#e6eef8',
                'accent_hex' => '#4a6fa5'
            ];
        } elseif (str_contains($catLower, 'poleras')) {
            return [
                'bg_rgb' => [245, 245, 245],
                'accent_rgb' => [43, 43, 43],
                'shape' => 'polera',
                'bg_hex' => '#f5f5f5',
                'accent_hex' => '#2b2b2b'
            ];
        } elseif (str_contains($catLower, 'blusas')) {
            return [
                'bg_rgb' => [250, 237, 232],
                'accent_rgb' => [215, 122, 97],
                'shape' => 'blusa',
                'bg_hex' => '#faede8',
                'accent_hex' => '#d77a61'
            ];
        } elseif (str_contains($catLower, 'vestidos')) {
            return [
                'bg_rgb' => [251, 242, 239],
                'accent_rgb' => [224, 122, 95],
                'shape' => 'vestido',
                'bg_hex' => '#fbf2ef',
                'accent_hex' => '#e07a5f'
            ];
        } elseif (str_contains($catLower, 'chamarras') || str_contains($catLower, 'abrigos')) {
            return [
                'bg_rgb' => [240, 244, 248],
                'accent_rgb' => [29, 53, 87],
                'shape' => 'chamarra',
                'bg_hex' => '#f0f4f8',
                'accent_hex' => '#1d3557'
            ];
        } elseif (str_contains($catLower, 'deportivos') || str_contains($catLower, 'deporte')) {
            return [
                'bg_rgb' => [241, 250, 238],
                'accent_rgb' => [69, 123, 157],
                'shape' => 'deportivo',
                'bg_hex' => '#f1faee',
                'accent_hex' => '#457b9d'
            ];
        } elseif (str_contains($catLower, 'faldas')) {
            return [
                'bg_rgb' => [254, 250, 224],
                'accent_rgb' => [233, 196, 106],
                'shape' => 'falda',
                'bg_hex' => '#fefae0',
                'accent_hex' => '#e9c46a'
            ];
        } elseif (str_contains($catLower, 'accesorios')) {
            return [
                'bg_rgb' => [233, 245, 243],
                'accent_rgb' => [42, 157, 143],
                'shape' => 'accesorio',
                'bg_hex' => '#e9f5f3',
                'accent_hex' => '#2a9d8f'
            ];
        } elseif (str_contains($catLower, 'liquidación') || str_contains($catLower, 'liquidacion')) {
            return [
                'bg_rgb' => [253, 240, 240],
                'accent_rgb' => [230, 57, 70],
                'shape' => 'liquidacion',
                'bg_hex' => '#fdf0f0',
                'accent_hex' => '#e63946'
            ];
        }

        return [
            'bg_rgb' => [244, 245, 246],
            'accent_rgb' => [79, 93, 117],
            'shape' => 'fallback',
            'bg_hex' => '#f4f5f6',
            'accent_hex' => '#4f5d75'
        ];
    }

    private function generarImagenPNG(string $path, string $nombre, string $categoria, string $precio, array $estilo, ?string $fontPath): void
    {
        $w = 600;
        $h = 800;
        $im = imagecreatetruecolor($w, $h);

        // Colores
        $bg = imagecolorallocate($im, $estilo['bg_rgb'][0], $estilo['bg_rgb'][1], $estilo['bg_rgb'][2]);
        $accent = imagecolorallocate($im, $estilo['accent_rgb'][0], $estilo['accent_rgb'][1], $estilo['accent_rgb'][2]);
        $dark = imagecolorallocate($im, 43, 34, 30); // Color principal texto café oscuro
        $muted = imagecolorallocate($im, 156, 163, 175); // Color secundario gris

        // Rellenar fondo
        imagefill($im, 0, 0, $bg);

        // Dibujar borde decorativo tipo catálogo
        $margin = 25;
        imagerectangle($im, $margin, $margin, $w - $margin, $h - $margin, $accent);
        imagerectangle($im, $margin + 5, $margin + 5, $w - ($margin + 5), $h - ($margin + 5), $accent);

        // Dibujar marca de agua/etiqueta superior
        $this->renderTexto($im, 'AKINOMASS / DEFENSE DEMO', 11, $w / 2, 70, $muted, $fontPath);

        // Dibujar silueta geométrica según tipo
        $this->dibujarSiluetaGD($im, $estilo['shape'], $accent);

        // Dibujar datos inferiores del producto
        $this->renderTexto($im, mb_strtoupper($categoria), 13, $w / 2, 650, $accent, $fontPath);
        $this->renderTexto($im, $nombre, 18, $w / 2, 690, $dark, $fontPath);
        $this->renderTexto($im, $precio, 22, $w / 2, 740, $dark, $fontPath);

        // Guardar archivo
        imagepng($im, $path);
        imagedestroy($im);
    }

    private function dibujarSiluetaGD($im, string $shape, $color): void
    {
        switch ($shape) {
            case 'pantalon':
                // Pretina
                imagefilledrectangle($im, 220, 270, 380, 295, $color);
                // Pierna Izquierda
                $puntosIzq = [
                    220, 295,
                    285, 295,
                    270, 560,
                    200, 560
                ];
                imagefilledpolygon($im, $puntosIzq, $color);
                // Pierna Derecha
                $puntosDer = [
                    315, 295,
                    380, 295,
                    400, 560,
                    330, 560
                ];
                imagefilledpolygon($im, $puntosDer, $color);
                break;

            case 'polera':
                // Torso / Cuerpo
                imagefilledrectangle($im, 210, 290, 390, 510, $color);
                // Manga Izquierda
                $mangaIzq = [
                    210, 290,
                    210, 380,
                    150, 360,
                    165, 290
                ];
                imagefilledpolygon($im, $mangaIzq, $color);
                // Manga Derecha
                $mangaDer = [
                    390, 290,
                    390, 380,
                    450, 360,
                    435, 290
                ];
                imagefilledpolygon($im, $mangaDer, $color);
                // Cuello (círculo de fondo para hacer recorte)
                $bgCol = imagecolorat($im, 10, 10);
                imagefilledellipse($im, 300, 290, 70, 30, $bgCol);
                break;

            case 'blusa':
                // Torso acampanado
                $torso = [
                    230, 290,
                    370, 290,
                    390, 490,
                    210, 490
                ];
                imagefilledpolygon($im, $torso, $color);
                // Tirantes finos
                imagefilledrectangle($im, 250, 260, 260, 290, $color);
                imagefilledrectangle($im, 340, 260, 350, 290, $color);
                break;

            case 'vestido':
                // Corsé / Pecho
                $pecho = [
                    240, 270,
                    360, 270,
                    340, 360,
                    260, 360
                ];
                imagefilledpolygon($im, $pecho, $color);
                // Falda larga campana
                $falda = [
                    260, 360,
                    340, 360,
                    440, 570,
                    160, 570
                ];
                imagefilledpolygon($im, $falda, $color);
                // Tirantes
                imagefilledrectangle($im, 260, 240, 268, 270, $color);
                imagefilledrectangle($im, 332, 240, 340, 270, $color);
                break;

            case 'chamarra':
                // Cuerpo abrigo grueso
                imagefilledrectangle($im, 195, 290, 405, 520, $color);
                // Mangas gruesas
                $mangaIzq = [
                    195, 290,
                    195, 380,
                    145, 480,
                    120, 460,
                    170, 290
                ];
                imagefilledpolygon($im, $mangaIzq, $color);
                $mangaDer = [
                    405, 290,
                    405, 380,
                    455, 480,
                    480, 460,
                    430, 290
                ];
                imagefilledpolygon($im, $mangaDer, $color);
                // Línea cierre / cremallera central en contraste (blanco)
                $blanco = imagecolorallocate($im, 255, 255, 255);
                imagefilledrectangle($im, 297, 290, 303, 520, $blanco);
                // Cuello alto
                imagefilledrectangle($im, 260, 265, 340, 290, $color);
                break;

            case 'deportivo':
                // Buzo superior con capucha
                imagefilledrectangle($im, 210, 310, 390, 510, $color);
                // Capucha
                imagefilledellipse($im, 300, 280, 110, 75, $color);
                // Rayas deportivas laterales blancas
                $blanco = imagecolorallocate($im, 255, 255, 255);
                imagefilledrectangle($im, 230, 310, 240, 510, $blanco);
                imagefilledrectangle($im, 360, 310, 370, 510, $blanco);
                break;

            case 'falda':
                // Cintura
                imagefilledrectangle($im, 240, 310, 360, 335, $color);
                // Falda plisada
                $falda = [
                    240, 335,
                    360, 335,
                    420, 550,
                    180, 550
                ];
                imagefilledpolygon($im, $falda, $color);
                break;

            case 'accesorio':
                // Bolso / Mochila
                imagefilledrectangle($im, 220, 330, 380, 510, $color);
                // Asa / Correa elíptica
                imagefilledellipse($im, 300, 330, 100, 80, $color);
                // Fondo interior del asa
                $bgCol = imagecolorat($im, 10, 10);
                imagefilledellipse($im, 300, 330, 80, 60, $bgCol);
                break;

            case 'liquidacion':
                // Etiqueta colgante angular
                $etiqueta = [
                    240, 270,
                    360, 270,
                    360, 480,
                    300, 550,
                    240, 480
                ];
                imagefilledpolygon($im, $etiqueta, $color);
                // Agujero de la etiqueta
                $bgCol = imagecolorat($im, 10, 10);
                imagefilledellipse($im, 300, 310, 25, 25, $bgCol);
                // Texto SALE interno
                $blanco = imagecolorallocate($im, 255, 255, 255);
                imagefilledrectangle($im, 270, 370, 330, 430, $blanco);
                break;

            default: // fallback
                // Percha / Icono caja simple
                imagefilledrectangle($im, 230, 320, 370, 460, $color);
                imagefilledellipse($im, 300, 300, 60, 60, $color);
                $bgCol = imagecolorat($im, 10, 10);
                imagefilledellipse($im, 300, 300, 40, 40, $bgCol);
                break;
        }
    }

    private function renderTexto($im, string $texto, int $size, int $x, int $y, $color, ?string $fontPath): void
    {
        if ($fontPath) {
            // Calcular caja para centrar texto
            $bbox = imagettfbbox($size, 0, $fontPath, $texto);
            $width = $bbox[2] - $bbox[0];
            $xReal = $x - ($width / 2);
            imagettftext($im, $size, 0, $xReal, $y, $color, $fontPath, $texto);
        } else {
            // Fallback usando imagestring
            // Fuentes integradas: 1 a 5. Usamos 5 para mayor tamaño.
            $font = 5;
            $charWidth = 9;
            $charHeight = 15;
            $width = strlen($texto) * $charWidth;
            $xReal = $x - ($width / 2);
            $yReal = $y - ($charHeight / 2);
            imagestring($im, $font, $xReal, $yReal, $texto, $color);
        }
    }

    private function generarImagenSVG(string $path, string $nombre, string $categoria, string $precio, array $estilo): void
    {
        $bg = $estilo['bg_hex'];
        $accent = $estilo['accent_hex'];
        $shapeType = $estilo['shape'];

        $siluetaSVG = '';
        switch ($shapeType) {
            case 'pantalon':
                $siluetaSVG = "
                    <rect x='220' y='270' width='160' height='25' fill='{$accent}' />
                    <polygon points='220,295 285,295 270,560 200,560' fill='{$accent}' />
                    <polygon points='315,295 380,295 400,560 330,560' fill='{$accent}' />
                ";
                break;
            case 'polera':
                $siluetaSVG = "
                    <rect x='210' y='290' width='180' height='220' fill='{$accent}' />
                    <polygon points='210,290 210,380 150,360 165,290' fill='{$accent}' />
                    <polygon points='390,290 390,380 450,360 435,290' fill='{$accent}' />
                    <ellipse cx='300' cy='290' rx='35' ry='15' fill='{$bg}' />
                ";
                break;
            case 'blusa':
                $siluetaSVG = "
                    <polygon points='230,290 370,290 390,490 210,490' fill='{$accent}' />
                    <rect x='250' y='260' width='10' height='30' fill='{$accent}' />
                    <rect x='340' y='260' width='10' height='30' fill='{$accent}' />
                ";
                break;
            case 'vestido':
                $siluetaSVG = "
                    <polygon points='240,270 360,270 340,360 260,360' fill='{$accent}' />
                    <polygon points='260,360 340,360 440,570 160,570' fill='{$accent}' />
                    <rect x='260' y='240' width='8' height='30' fill='{$accent}' />
                    <rect x='332' y='240' width='8' height='30' fill='{$accent}' />
                ";
                break;
            case 'chamarra':
                $siluetaSVG = "
                    <rect x='195' y='290' width='210' height='230' fill='{$accent}' />
                    <polygon points='195,290 195,380 145,480 120,460 170,290' fill='{$accent}' />
                    <polygon points='405,290 405,380 455,480 480,460 430,290' fill='{$accent}' />
                    <rect x='297' y='290' width='6' height='230' fill='#ffffff' />
                    <rect x='260' y='265' width='80' height='25' fill='{$accent}' />
                ";
                break;
            case 'deportivo':
                $siluetaSVG = "
                    <rect x='210' y='310' width='180' height='200' fill='{$accent}' />
                    <ellipse cx='300' cy='280' rx='55' ry='37.5' fill='{$accent}' />
                    <rect x='230' y='310' width='10' height='200' fill='#ffffff' />
                    <rect x='360' y='310' width='10' height='200' fill='#ffffff' />
                ";
                break;
            case 'falda':
                $siluetaSVG = "
                    <rect x='240' y='310' width='120' height='25' fill='{$accent}' />
                    <polygon points='240,335 360,335 420,550 180,550' fill='{$accent}' />
                ";
                break;
            case 'accesorio':
                $siluetaSVG = "
                    <rect x='220' y='330' width='160' height='180' fill='{$accent}' />
                    <ellipse cx='300' cy='330' rx='50' ry='40' fill='{$accent}' />
                    <ellipse cx='300' cy='330' rx='40' ry='30' fill='{$bg}' />
                ";
                break;
            case 'liquidacion':
                $siluetaSVG = "
                    <polygon points='240,270 360,270 360,480 300,550 240,480' fill='{$accent}' />
                    <circle cx='300' cy='310' r='12.5' fill='{$bg}' />
                    <rect x='270' y='370' width='60' height='60' fill='#ffffff' />
                    <text x='300' y='410' text-anchor='middle' font-family='Arial' font-size='16' font-weight='bold' fill='{$accent}'>SALE</text>
                ";
                break;
            default:
                $siluetaSVG = "
                    <rect x='230' y='320' width='140' height='140' fill='{$accent}' />
                    <circle cx='300' cy='300' r='30' fill='{$accent}' />
                    <circle cx='300' cy='300' r='20' fill='{$bg}' />
                ";
                break;
        }

        $svgContent = "<?xml version='1.0' encoding='UTF-8' standalone='no'?>
<svg width='600' height='800' xmlns='http://www.w3.org/2000/svg' version='1.1'>
    <rect width='100%' height='100%' fill='{$bg}' />
    <rect x='25' y='25' width='550' height='750' fill='none' stroke='{$accent}' stroke-width='4' />
    <rect x='30' y='30' width='540' height='740' fill='none' stroke='{$accent}' stroke-width='1' />
    
    <text x='50%' y='75' text-anchor='middle' font-family='Arial, sans-serif' font-size='12' font-weight='600' fill='#9CA3AF' letter-spacing='1'>AKINOMASS / DEFENSE DEMO</text>
    
    <!-- Silueta -->
    <g>
        {$siluetaSVG}
    </g>
    
    <!-- Textos del producto -->
    <text x='50%' y='650' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' font-weight='bold' fill='{$accent}' letter-spacing='0.5'>" . htmlspecialchars(mb_strtoupper($categoria)) . "</text>
    <text x='50%' y='695' text-anchor='middle' font-family='Arial, sans-serif' font-size='20' font-weight='800' fill='#2B221E'>" . htmlspecialchars($nombre) . "</text>
    <text x='50%' y='745' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' font-weight='900' fill='#2B221E'>{$precio}</text>
</svg>";

        File::put($path, $svgContent);
    }
}
