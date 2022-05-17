export interface EXA_Extracto_ahorro {
    fecha: string;
    hora: string;
    descripcion: string;
    servicio: string;
    saldo_anterior: number;
    valor: number;
    saldo_final: number;
    usuario: string;
    cliente_responsable: string;
    cliente_afectado: string;
}

export interface EXA_Indicadores{
    fecha: string;
    saldo_anterior: number;
    entradas: number;
    salidas: number;
    saldo_final: number;
}
