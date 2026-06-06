<?php

namespace App\Domains\Auditoria\DTOs;

class RegistrarAuditoriaData
{
    public function __construct(
        public readonly ?int $userId,
        public readonly ?int $codCliente,
        public readonly string $modulo,
        public readonly ?string $submodulo,
        public readonly string $tabla,
        public readonly string $idRegistro,
        public readonly string $accion,
        public readonly ?string $accionFuncional,
        public readonly ?string $descripcion,
        public readonly ?string $campo,
        public readonly ?string $valorAnterior,
        public readonly ?string $valorNuevo,
        public readonly ?string $metodoHttp,
        public readonly ?string $ip,
        public readonly ?string $userAgent,
        public readonly ?string $dispositivo,
        public readonly ?string $navegador,
        public readonly ?string $sistemaOperativo,
        public readonly ?string $idEvento,
    ) {}

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'cod_cliente' => $this->codCliente,
            'fecha_aud' => now(),
            'modulo_aud' => $this->modulo,
            'submodulo_aud' => $this->submodulo,
            'tabla_aud' => $this->tabla,
            'id_registro_aud' => $this->idRegistro,
            'accion_aud' => $this->accion,
            'accion_funcional_aud' => $this->accionFuncional,
            'descripcion_aud' => $this->descripcion,
            'campo_aud' => $this->campo,
            'valor_anterior_aud' => $this->valorAnterior,
            'valor_nuevo_aud' => $this->valorNuevo,
            'metodo_http_aud' => $this->metodoHttp,
            'ip_aud' => $this->ip,
            'user_agent_aud' => $this->userAgent,
            'dispositivo_aud' => $this->dispositivo,
            'navegador_aud' => $this->navegador,
            'sistema_operativo_aud' => $this->sistemaOperativo,
            'id_evento_aud' => $this->idEvento,
        ];
    }

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        $userAgent = $request->userAgent();
        $parsed = self::parseUserAgent($userAgent);

        return new self(
            userId: $request->user()?->id,
            codCliente: null,
            modulo: '',
            submodulo: null,
            tabla: '',
            idRegistro: '',
            accion: '',
            accionFuncional: null,
            descripcion: null,
            campo: null,
            valorAnterior: null,
            valorNuevo: null,
            metodoHttp: $request->method(),
            ip: $request->ip(),
            userAgent: $userAgent,
            dispositivo: $parsed['dispositivo'],
            navegador: $parsed['navegador'],
            sistemaOperativo: $parsed['sistema_operativo'],
            idEvento: null,
        );
    }

    public function withAuditData(
        string $modulo,
        ?string $submodulo,
        string $tabla,
        string $idRegistro,
        string $accion,
        ?string $accionFuncional = null,
        ?string $descripcion = null,
        ?string $campo = null,
        ?string $valorAnterior = null,
        ?string $valorNuevo = null,
        ?string $idEvento = null,
    ): self {
        return new self(
            userId: $this->userId,
            codCliente: $this->codCliente,
            modulo: $modulo,
            submodulo: $submodulo,
            tabla: $tabla,
            idRegistro: $idRegistro,
            accion: $accion,
            accionFuncional: $accionFuncional,
            descripcion: $descripcion,
            campo: $campo,
            valorAnterior: $valorAnterior,
            valorNuevo: $valorNuevo,
            metodoHttp: $this->metodoHttp,
            ip: $this->ip,
            userAgent: $this->userAgent,
            dispositivo: $this->dispositivo,
            navegador: $this->navegador,
            sistemaOperativo: $this->sistemaOperativo,
            idEvento: $idEvento,
        );
    }

    public function withCliente(?int $codCliente): self
    {
        return new self(
            userId: $this->userId,
            codCliente: $codCliente,
            modulo: $this->modulo,
            submodulo: $this->submodulo,
            tabla: $this->tabla,
            idRegistro: $this->idRegistro,
            accion: $this->accion,
            accionFuncional: $this->accionFuncional,
            descripcion: $this->descripcion,
            campo: $this->campo,
            valorAnterior: $this->valorAnterior,
            valorNuevo: $this->valorNuevo,
            metodoHttp: $this->metodoHttp,
            ip: $this->ip,
            userAgent: $this->userAgent,
            dispositivo: $this->dispositivo,
            navegador: $this->navegador,
            sistemaOperativo: $this->sistemaOperativo,
            idEvento: $this->idEvento,
        );
    }

    private static function parseUserAgent(?string $userAgent): array
    {
        $result = [
            'dispositivo' => null,
            'navegador' => null,
            'sistema_operativo' => null,
        ];

        if (!$userAgent) {
            return $result;
        }

        if (str_contains($userAgent, 'Windows')) {
            $result['sistema_operativo'] = 'Windows';
        } elseif (str_contains($userAgent, 'Mac')) {
            $result['sistema_operativo'] = 'macOS';
        } elseif (str_contains($userAgent, 'Linux') && !str_contains($userAgent, 'Android')) {
            $result['sistema_operativo'] = 'Linux';
        } elseif (str_contains($userAgent, 'Android')) {
            $result['sistema_operativo'] = 'Android';
            $result['dispositivo'] = 'Móvil';
        } elseif (str_contains($userAgent, 'iPhone') || str_contains($userAgent, 'iPad')) {
            $result['sistema_operativo'] = 'iOS';
            $result['dispositivo'] = str_contains($userAgent, 'iPad') ? 'Tablet' : 'Móvil';
        }

        if (str_contains($userAgent, 'Chrome') && !str_contains($userAgent, 'Edg')) {
            $result['navegador'] = 'Chrome';
        } elseif (str_contains($userAgent, 'Firefox')) {
            $result['navegador'] = 'Firefox';
        } elseif (str_contains($userAgent, 'Edg')) {
            $result['navegador'] = 'Edge';
        } elseif (str_contains($userAgent, 'Safari') && !str_contains($userAgent, 'Chrome')) {
            $result['navegador'] = 'Safari';
        }

        if (!$result['dispositivo']) {
            $result['dispositivo'] = 'Escritorio';
        }

        return $result;
    }
}
