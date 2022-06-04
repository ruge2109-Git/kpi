export interface MiEn_Movimientos{
    cod_movimientos?: string;
    id:string;
    movimiento:string;
    producto:string;
    descripcion:string;
    valor:number;
    saldo_anterior:number;
    nuevo_saldo:number;
    fecha:string;
    tipo:string;
}
