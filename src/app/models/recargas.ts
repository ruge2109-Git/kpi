
export interface Sales_report {
    cod_sales_report?: number;
    id_transaccion: string;
    id_cliente: number;
    cliente: string;
    canal: string;
    operador: string;
    linea: string;
    id_convenio: string;
    nombre_convenio: string;
    comision: number;
    fecha: string;
    hora: string;
    valor: number;
    saldo_final: number;
    bolsa: string;
    estado: string;
    usuario: string;
    creado_por: string;
}

export interface SR_Cliente_Canal {
    cliente: string;
    canal: string;
    cantidad: number;
    fecha: string;
    valor: number;
}

export interface SR_Cliente_Operador {
    cliente: string;
    operador: string;
    cantidad: number;
    fecha: string;
    valor: number;
}

export interface SR_top_canal{
    canal: string;
    fecha: string;
    cantidad: number;
    valor: number;
}

export interface SR_top_operador{
    operador: string;
    fecha: string;
    cantidad: number;
    valor: number;
}

export interface SR_top_cliente{
    id_cliente: number;
    cliente: number;
    fecha: string;
    cantidad: number;
    valor: number;
}
