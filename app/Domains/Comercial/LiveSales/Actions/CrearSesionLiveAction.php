<?php namespace App\Domains\Comercial\LiveSales\Actions; use App\Models\SesionLive; class CrearSesionLiveAction{ public function execute(array $data):SesionLive{ return SesionLive::create($data);} }
