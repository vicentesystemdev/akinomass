<?php

namespace Tests\Feature\Admin;

class CategoriaTest extends AdminTestCase
{
    public function test_admin_puede_crear_categoria(): void
    {
        $this->actingAs($this->admin);

        $response = $this->post(route('categorias-producto.store'), [
            'nombre_cat' => 'Nueva Categoria',
            'descripcion_cat' => 'Descripcion de prueba',
            'activo_cat' => true,
        ]);

        $response->assertRedirect(route('categorias-producto.index'));
        $this->assertDatabaseHas('categorias_producto', [
            'nombre_cat' => 'Nueva Categoria',
        ]);
    }

    public function test_crear_categoria_requiere_nombre(): void
    {
        $this->actingAs($this->admin);

        $response = $this->post(route('categorias-producto.store'), [
            'nombre_cat' => '',
            'activo_cat' => true,
        ]);

        $response->assertSessionHasErrors('nombre_cat');
    }

    public function test_no_permite_crear_categoria_con_nombre_repetido(): void
    {
        $this->crearCategoria(['nombre_cat' => 'Blusas']);
        $this->actingAs($this->admin);

        $response = $this->post(route('categorias-producto.store'), [
            'nombre_cat' => '  BLUSAS  ',
            'activo_cat' => true,
        ]);

        $response->assertSessionHasErrors([
            'nombre_cat' => 'Ya existe una categoría con este nombre.',
        ]);
    }

    public function test_admin_puede_editar_categoria(): void
    {
        $categoria = $this->crearCategoria();

        $this->actingAs($this->admin);

        $response = $this->put(route('categorias-producto.update', $categoria), [
            'nombre_cat' => 'Categoria Editada',
            'descripcion_cat' => 'Nueva descripcion',
            'activo_cat' => true,
        ]);

        $response->assertRedirect(route('categorias-producto.index'));
        $this->assertDatabaseHas('categorias_producto', [
            'cod_categoria_producto' => $categoria->cod_categoria_producto,
            'nombre_cat' => 'Categoria Editada',
        ]);
    }

    public function test_editar_categoria_permite_conservar_su_nombre(): void
    {
        $categoria = $this->crearCategoria(['nombre_cat' => 'Calzados']);
        $this->actingAs($this->admin);

        $response = $this->put(route('categorias-producto.update', $categoria), [
            'nombre_cat' => 'Calzados',
            'descripcion_cat' => 'Actualizada',
            'activo_cat' => true,
        ]);

        $response->assertSessionDoesntHaveErrors();
        $response->assertRedirect(route('categorias-producto.index'));
    }

    public function test_no_permite_editar_categoria_con_nombre_de_otra_categoria(): void
    {
        $this->crearCategoria(['nombre_cat' => 'Blusas']);
        $categoria = $this->crearCategoria(['nombre_cat' => 'Pantalones']);
        $this->actingAs($this->admin);

        $response = $this->put(route('categorias-producto.update', $categoria), [
            'nombre_cat' => 'blusas',
            'activo_cat' => true,
        ]);

        $response->assertSessionHasErrors([
            'nombre_cat' => 'Ya existe una categoría con este nombre.',
        ]);
    }

    public function test_listar_categorias(): void
    {
        $this->crearCategoria(['nombre_cat' => 'Cat 1']);
        $this->crearCategoria(['nombre_cat' => 'Cat 2']);

        $this->actingAs($this->admin);

        $response = $this->get(route('categorias-producto.index'));

        $response->assertStatus(200);
    }

    public function test_editar_categoria_devuelve_datos_correctos(): void
    {
        $categoria = $this->crearCategoria(['nombre_cat' => 'Mi Categoria']);

        $this->actingAs($this->admin);

        $response = $this->get(route('categorias-producto.edit', $categoria));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->where('categoria.nombre_cat', 'Mi Categoria')
            ->has('categoria')
        );
    }
}
