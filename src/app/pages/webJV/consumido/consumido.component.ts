import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import readXlsxFile from 'read-excel-file';
import { lastValueFrom } from 'rxjs';
import { JV_Consumido_Ganancias, JV_Consumido_Indicadores, JV_Consumido_Recargas, JV_Consumido_Saldo } from 'src/app/models/RecargasJV';
import { RecargasJVService } from 'src/app/service/servicesApp/recargas-jv.service';

@Component({
    selector: 'app-consumido',
    templateUrl: './consumido.component.html',
    styleUrls: ['./consumido.component.scss']
})
export class ConsumidoComponent implements OnInit {

    //ListUploadFiles
    listNewGanancias: JV_Consumido_Ganancias[] = [];
    listNewSaldo: JV_Consumido_Saldo[] = [];
    listNewRecargas: JV_Consumido_Recargas[] = [];

    //listData
    listGanancias: JV_Consumido_Ganancias[] = [];
    listSaldo: JV_Consumido_Saldo[] = [];
    listRecargas: JV_Consumido_Recargas[] = [];

    //List indicadores
    listIndicadores: JV_Consumido_Indicadores[] = [];

    //Archivos
    uploadedFilesGanancias: any[] = [];
    uploadedFilesSaldo: any[] = [];
    uploadedFilesRecargas: any[] = [];

    //Progress
    showProgressBarGanancias: boolean = false;
    valueProgressBarGanancias: number = 1;

    showProgressBarRecargas: boolean = false;
    valueProgressBarRecargas: number = 1;

    showProgressBarSaldo: boolean = false;
    valueProgressBarSaldo: number = 1;

    //SPinners
    spinGanancias: boolean = false;
    spinSaldo: boolean = false;
    spinRecargas: boolean = false;
    spinIndicadores: boolean = false;

    //TABLAS
    @ViewChild('tableIndicadores') tableIndicadores: Table;
    @ViewChild('tableGanancias') tableGanancias: Table;
    @ViewChild('tableSaldos') tableSaldos: Table;
    @ViewChild('tableRecargas') tableRecargas: Table;

    //Fechas
    rangoFechasIndicadores: Date[] = [];
    rangoFechasGanancias: Date[] = [];
    rangoFechasSaldos: Date[] = [];
    rangoFechasRecargas: Date[] = [];

    //Total indicadores
    public totalGanancias: number = 0;
    public totalSaldos: number = 0;
    public totalRecargas: number = 0;
    //Promedio indicadores
    public promedioGanancias: number = 0;
    public promedioSaldos: number = 0;
    public promedioRecargas: number = 0;

    //TOTALES GANANCIAS
    public total_davivienda_pago_tarjeta_de_credito: number = 0;
    public total_davivienda_pago_de_credito: number = 0;
    public total_davivienda_deposito_davivienda: number = 0;
    public total_davivienda_retiro_davivienda: number = 0;
    public total_aval_tarjeta_de_credito_ban_bogota: number = 0;
    public total_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota: number = 0;
    public total_aval_credito_hipotecario_ban_bogota: number = 0;
    public total_aval_otros_creditos_ban_bogota: number = 0;
    public total_aval_credito_motos_vehiculos_ban_bogota: number = 0;
    public total_xbox_plata: number = 0;
    public total_imvu: number = 0;
    public total_keo: number = 0;
    public total_sisteCredito: number = 0;
    public total_claro: number = 0;
    public total_paquetes_claro: number = 0;
    public total_sura: number = 0;
    public total_movistar: number = 0;
    public total_paquetes_movistar: number = 0;
    public total_tigo: number = 0;
    public total_paquetes_tigo: number = 0;
    public total_avantel: number = 0;
    public total_paquetes_avantel: number = 0;
    public total_virgin: number = 0;
    public total_paquetes_virgin: number = 0;
    public total_etb: number = 0;
    public total_paquete_etb: number = 0;
    public total_exito: number = 0;
    public total_paquetes_exito: number = 0;
    public total_paquetes_conectame: number = 0;
    public total_flashMobile: number = 0;
    public total_direcTv: number = 0;
    public total_wom: number = 0;
    public total_paquetes_wom: number = 0;
    public total_kalley_mobile: number = 0;
    public total_paquetes_kalley_mobile: number = 0;
    public total_wings_mobile: number = 0;
    public total_paquetes_wings_mobile: number = 0;
    public total_unicorn: number = 0;
    public total_wplay: number = 0;
    public total_mega_apuesta: number = 0;
    public total_ya_juego: number = 0;
    public total_aqui_juego: number = 0;
    public total_rushBet: number = 0;
    public total_rivalo: number = 0;
    public total_miJugada: number = 0;
    public total_facturas_otros: number = 0;
    public total_facturas_de_gas_energia: number = 0;
    public total_sms: number = 0;
    public total_baloto: number = 0;
    public total_baloto_pago_de_premios: number = 0;
    public total_certificado_de_tradicion: number = 0;
    public total_runt: number = 0;
    public total_energia_prepago_essa: number = 0;
    public total_energia_Prepago_epm: number = 0;
    public total_soat_moto_estado: number = 0;
    public total_soat_carro_estado: number = 0;
    public total_soat_bus_estado: number = 0;
    public total_axa_soat_moto: number = 0;
    public total_axa_soat_carro: number = 0;
    public total_axa_soat_publico: number = 0;
    public total_movii_recargas: number = 0;
    public total_movii_retiros: number = 0;
    public total_daviplata_recargas: number = 0;
    public total_daviplata_retiros: number = 0;
    public total_taxia_recargas: number = 0;
    public total_tpaga_retiros: number = 0;
    public total_razer_gold: number = 0;
    public total_netflix: number = 0;
    public total_spotify: number = 0;
    public total_payValida: number = 0;
    public total_freeFire: number = 0;
    public total_noggin: number = 0;
    public total_crunchyroll: number = 0;
    public total_office: number = 0;
    public total_win_sport: number = 0;
    public total_dataCredito: number = 0;
    public total_paramount: number = 0;
    public total_xbox_suscripciones: number = 0;
    public total_play_station: number = 0;
    public total_play_station_suscripciones: number = 0;
    public total_minecraft: number = 0;
    public total_rixty: number = 0;
    public total_payCash: number = 0;
    public total_total: number = 0;

    //Promedios ganancias
    public promedio_davivienda_pago_tarjeta_de_credito: number = 0;
    public promedio_davivienda_pago_de_credito: number = 0;
    public promedio_davivienda_deposito_davivienda: number = 0;
    public promedio_davivienda_retiro_davivienda: number = 0;
    public promedio_aval_tarjeta_de_credito_ban_bogota: number = 0;
    public promedio_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota: number = 0;
    public promedio_aval_credito_hipotecario_ban_bogota: number = 0;
    public promedio_aval_otros_creditos_ban_bogota: number = 0;
    public promedio_aval_credito_motos_vehiculos_ban_bogota: number = 0;
    public promedio_xbox_plata: number = 0;
    public promedio_imvu: number = 0;
    public promedio_keo: number = 0;
    public promedio_sisteCredito: number = 0;
    public promedio_claro: number = 0;
    public promedio_paquetes_claro: number = 0;
    public promedio_sura: number = 0;
    public promedio_movistar: number = 0;
    public promedio_paquetes_movistar: number = 0;
    public promedio_tigo: number = 0;
    public promedio_paquetes_tigo: number = 0;
    public promedio_avantel: number = 0;
    public promedio_paquetes_avantel: number = 0;
    public promedio_virgin: number = 0;
    public promedio_paquetes_virgin: number = 0;
    public promedio_etb: number = 0;
    public promedio_paquete_etb: number = 0;
    public promedio_exito: number = 0;
    public promedio_paquetes_exito: number = 0;
    public promedio_paquetes_conectame: number = 0;
    public promedio_flashMobile: number = 0;
    public promedio_direcTv: number = 0;
    public promedio_wom: number = 0;
    public promedio_paquetes_wom: number = 0;
    public promedio_kalley_mobile: number = 0;
    public promedio_paquetes_kalley_mobile: number = 0;
    public promedio_wings_mobile: number = 0;
    public promedio_paquetes_wings_mobile: number = 0;
    public promedio_unicorn: number = 0;
    public promedio_wplay: number = 0;
    public promedio_mega_apuesta: number = 0;
    public promedio_ya_juego: number = 0;
    public promedio_aqui_juego: number = 0;
    public promedio_rushBet: number = 0;
    public promedio_rivalo: number = 0;
    public promedio_miJugada: number = 0;
    public promedio_facturas_otros: number = 0;
    public promedio_facturas_de_gas_energia: number = 0;
    public promedio_sms: number = 0;
    public promedio_baloto: number = 0;
    public promedio_baloto_pago_de_premios: number = 0;
    public promedio_certificado_de_tradicion: number = 0;
    public promedio_runt: number = 0;
    public promedio_energia_prepago_essa: number = 0;
    public promedio_energia_Prepago_epm: number = 0;
    public promedio_soat_moto_estado: number = 0;
    public promedio_soat_carro_estado: number = 0;
    public promedio_soat_bus_estado: number = 0;
    public promedio_axa_soat_moto: number = 0;
    public promedio_axa_soat_carro: number = 0;
    public promedio_axa_soat_publico: number = 0;
    public promedio_movii_recargas: number = 0;
    public promedio_movii_retiros: number = 0;
    public promedio_daviplata_recargas: number = 0;
    public promedio_daviplata_retiros: number = 0;
    public promedio_taxia_recargas: number = 0;
    public promedio_tpaga_retiros: number = 0;
    public promedio_razer_gold: number = 0;
    public promedio_netflix: number = 0;
    public promedio_spotify: number = 0;
    public promedio_payValida: number = 0;
    public promedio_freeFire: number = 0;
    public promedio_noggin: number = 0;
    public promedio_crunchyroll: number = 0;
    public promedio_office: number = 0;
    public promedio_win_sport: number = 0;
    public promedio_dataCredito: number = 0;
    public promedio_paramount: number = 0;
    public promedio_xbox_suscripciones: number = 0;
    public promedio_play_station: number = 0;
    public promedio_play_station_suscripciones: number = 0;
    public promedio_minecraft: number = 0;
    public promedio_rixty: number = 0;
    public promedio_payCash: number = 0;
    public promedio_total: number = 0;


    //TOTALES SALDOS
    public total_saldo_davivienda_pago_tarjeta_de_credito: number = 0;
    public total_saldo_davivienda_pago_de_credito: number = 0;
    public total_saldo_davivienda_deposito_davivienda: number = 0;
    public total_saldo_davivienda_retiro_davivienda: number = 0;
    public total_saldo_aval_tarjeta_de_credito_ban_bogota: number = 0;
    public total_saldo_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota: number = 0;
    public total_saldo_aval_credito_hipotecario_ban_bogota: number = 0;
    public total_saldo_aval_otros_creditos_ban_bogota: number = 0;
    public total_saldo_aval_credito_motos_vehiculos_ban_bogota: number = 0;
    public total_saldo_xbox_plata: number = 0;
    public total_saldo_imvu: number = 0;
    public total_saldo_keo: number = 0;
    public total_saldo_sisteCredito: number = 0;
    public total_saldo_claro: number = 0;
    public total_saldo_paquetes_claro: number = 0;
    public total_saldo_sura: number = 0;
    public total_saldo_movistar: number = 0;
    public total_saldo_paquetes_movistar: number = 0;
    public total_saldo_tigo: number = 0;
    public total_saldo_paquetes_tigo: number = 0;
    public total_saldo_avantel: number = 0;
    public total_saldo_paquetes_avantel: number = 0;
    public total_saldo_virgin: number = 0;
    public total_saldo_paquetes_virgin: number = 0;
    public total_saldo_etb: number = 0;
    public total_saldo_paquete_etb: number = 0;
    public total_saldo_exito: number = 0;
    public total_saldo_paquetes_exito: number = 0;
    public total_saldo_paquetes_conectame: number = 0;
    public total_saldo_flashMobile: number = 0;
    public total_saldo_direcTv: number = 0;
    public total_saldo_wom: number = 0;
    public total_saldo_paquetes_wom: number = 0;
    public total_saldo_kalley_mobile: number = 0;
    public total_saldo_paquetes_kalley_mobile: number = 0;
    public total_saldo_wings_mobile: number = 0;
    public total_saldo_paquetes_wings_mobile: number = 0;
    public total_saldo_unicorn: number = 0;
    public total_saldo_wplay: number = 0;
    public total_saldo_mega_apuesta: number = 0;
    public total_saldo_ya_juego: number = 0;
    public total_saldo_aqui_juego: number = 0;
    public total_saldo_rushBet: number = 0;
    public total_saldo_rivalo: number = 0;
    public total_saldo_miJugada: number = 0;
    public total_saldo_facturas_otros: number = 0;
    public total_saldo_facturas_de_gas_energia: number = 0;
    public total_saldo_sms: number = 0;
    public total_saldo_baloto: number = 0;
    public total_saldo_baloto_pago_de_premios: number = 0;
    public total_saldo_certificado_de_tradicion: number = 0;
    public total_saldo_runt: number = 0;
    public total_saldo_energia_prepago_essa: number = 0;
    public total_saldo_energia_Prepago_epm: number = 0;
    public total_saldo_soat_moto_estado: number = 0;
    public total_saldo_soat_carro_estado: number = 0;
    public total_saldo_soat_bus_estado: number = 0;
    public total_saldo_axa_soat_moto: number = 0;
    public total_saldo_axa_soat_carro: number = 0;
    public total_saldo_axa_soat_publico: number = 0;
    public total_saldo_movii_recargas: number = 0;
    public total_saldo_movii_retiros: number = 0;
    public total_saldo_daviplata_recargas: number = 0;
    public total_saldo_daviplata_retiros: number = 0;
    public total_saldo_taxia_recargas: number = 0;
    public total_saldo_tpaga_retiros: number = 0;
    public total_saldo_razer_gold: number = 0;
    public total_saldo_netflix: number = 0;
    public total_saldo_spotify: number = 0;
    public total_saldo_payValida: number = 0;
    public total_saldo_freeFire: number = 0;
    public total_saldo_noggin: number = 0;
    public total_saldo_crunchyroll: number = 0;
    public total_saldo_office: number = 0;
    public total_saldo_win_sport: number = 0;
    public total_saldo_dataCredito: number = 0;
    public total_saldo_paramount: number = 0;
    public total_saldo_xbox_suscripciones: number = 0;
    public total_saldo_play_station: number = 0;
    public total_saldo_play_station_suscripciones: number = 0;
    public total_saldo_minecraft: number = 0;
    public total_saldo_rixty: number = 0;
    public total_saldo_payCash: number = 0;
    public total_saldo_total: number = 0;

    //Promedios saldos
    public promedio_saldos_davivienda_pago_tarjeta_de_credito: number = 0;
    public promedio_saldos_davivienda_pago_de_credito: number = 0;
    public promedio_saldos_davivienda_deposito_davivienda: number = 0;
    public promedio_saldos_davivienda_retiro_davivienda: number = 0;
    public promedio_saldos_aval_tarjeta_de_credito_ban_bogota: number = 0;
    public promedio_saldos_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota: number = 0;
    public promedio_saldos_aval_credito_hipotecario_ban_bogota: number = 0;
    public promedio_saldos_aval_otros_creditos_ban_bogota: number = 0;
    public promedio_saldos_aval_credito_motos_vehiculos_ban_bogota: number = 0;
    public promedio_saldos_xbox_plata: number = 0;
    public promedio_saldos_imvu: number = 0;
    public promedio_saldos_keo: number = 0;
    public promedio_saldos_sisteCredito: number = 0;
    public promedio_saldos_claro: number = 0;
    public promedio_saldos_paquetes_claro: number = 0;
    public promedio_saldos_sura: number = 0;
    public promedio_saldos_movistar: number = 0;
    public promedio_saldos_paquetes_movistar: number = 0;
    public promedio_saldos_tigo: number = 0;
    public promedio_saldos_paquetes_tigo: number = 0;
    public promedio_saldos_avantel: number = 0;
    public promedio_saldos_paquetes_avantel: number = 0;
    public promedio_saldos_virgin: number = 0;
    public promedio_saldos_paquetes_virgin: number = 0;
    public promedio_saldos_etb: number = 0;
    public promedio_saldos_paquete_etb: number = 0;
    public promedio_saldos_exito: number = 0;
    public promedio_saldos_paquetes_exito: number = 0;
    public promedio_saldos_paquetes_conectame: number = 0;
    public promedio_saldos_flashMobile: number = 0;
    public promedio_saldos_direcTv: number = 0;
    public promedio_saldos_wom: number = 0;
    public promedio_saldos_paquetes_wom: number = 0;
    public promedio_saldos_kalley_mobile: number = 0;
    public promedio_saldos_paquetes_kalley_mobile: number = 0;
    public promedio_saldos_wings_mobile: number = 0;
    public promedio_saldos_paquetes_wings_mobile: number = 0;
    public promedio_saldos_unicorn: number = 0;
    public promedio_saldos_wplay: number = 0;
    public promedio_saldos_mega_apuesta: number = 0;
    public promedio_saldos_ya_juego: number = 0;
    public promedio_saldos_aqui_juego: number = 0;
    public promedio_saldos_rushBet: number = 0;
    public promedio_saldos_rivalo: number = 0;
    public promedio_saldos_miJugada: number = 0;
    public promedio_saldos_facturas_otros: number = 0;
    public promedio_saldos_facturas_de_gas_energia: number = 0;
    public promedio_saldos_sms: number = 0;
    public promedio_saldos_baloto: number = 0;
    public promedio_saldos_baloto_pago_de_premios: number = 0;
    public promedio_saldos_certificado_de_tradicion: number = 0;
    public promedio_saldos_runt: number = 0;
    public promedio_saldos_energia_prepago_essa: number = 0;
    public promedio_saldos_energia_Prepago_epm: number = 0;
    public promedio_saldos_soat_moto_estado: number = 0;
    public promedio_saldos_soat_carro_estado: number = 0;
    public promedio_saldos_soat_bus_estado: number = 0;
    public promedio_saldos_axa_soat_moto: number = 0;
    public promedio_saldos_axa_soat_carro: number = 0;
    public promedio_saldos_axa_soat_publico: number = 0;
    public promedio_saldos_movii_recargas: number = 0;
    public promedio_saldos_movii_retiros: number = 0;
    public promedio_saldos_daviplata_recargas: number = 0;
    public promedio_saldos_daviplata_retiros: number = 0;
    public promedio_saldos_taxia_recargas: number = 0;
    public promedio_saldos_tpaga_retiros: number = 0;
    public promedio_saldos_razer_gold: number = 0;
    public promedio_saldos_netflix: number = 0;
    public promedio_saldos_spotify: number = 0;
    public promedio_saldos_payValida: number = 0;
    public promedio_saldos_freeFire: number = 0;
    public promedio_saldos_noggin: number = 0;
    public promedio_saldos_crunchyroll: number = 0;
    public promedio_saldos_office: number = 0;
    public promedio_saldos_win_sport: number = 0;
    public promedio_saldos_dataCredito: number = 0;
    public promedio_saldos_paramount: number = 0;
    public promedio_saldos_xbox_suscripciones: number = 0;
    public promedio_saldos_play_station: number = 0;
    public promedio_saldos_play_station_suscripciones: number = 0;
    public promedio_saldos_minecraft: number = 0;
    public promedio_saldos_rixty: number = 0;
    public promedio_saldos_payCash: number = 0;
    public promedio_saldos_total: number = 0;

    //TOtal recargas
    public total_recargas_ayudas_a_familias: number = 0;
    public total_recargas_claro: number = 0;
    public total_recargas_paquetes_claro: number = 0;
    public total_recargas_paquetes_movistar: number = 0;
    public total_recargas_movistar: number = 0;
    public total_recargas_paquetes_tigo: number = 0;
    public total_recargas_tigo: number = 0;
    public total_recargas_avantel: number = 0;
    public total_recargas_paquetes_avantel: number = 0;
    public total_recargas_virgin: number = 0;
    public total_recargas_paquetes_virgin: number = 0;
    public total_recargas_paquete_etb: number = 0;
    public total_recargas_etb: number = 0;
    public total_recargas_exito: number = 0;
    public total_recargas_paquetes_exito: number = 0;
    public total_recargas_paquetes_conectame: number = 0;
    public total_recargas_conectame: number = 0;
    public total_recargas_sipmobile: number = 0;
    public total_recargas_flashmobile: number = 0;
    public total_recargas_directv: number = 0;
    public total_recargas_iyo_movil: number = 0;
    public total_recargas_comunicamos: number = 0;
    public total_recargas_wom: number = 0;
    public total_recargas_paquetes_wom: number = 0;
    public total_recargas_kalley_mobile: number = 0;
    public total_recargas_paquetes_kalley: number = 0;
    public total_recargas_total: number = 0;

    //Promedio recargas
    public promedio_total_recargas_ayudas_a_familias: number = 0;
    public promedio_total_recargas_claro: number = 0;
    public promedio_total_recargas_paquetes_claro: number = 0;
    public promedio_total_recargas_paquetes_movistar: number = 0;
    public promedio_total_recargas_movistar: number = 0;
    public promedio_total_recargas_paquetes_tigo: number = 0;
    public promedio_total_recargas_tigo: number = 0;
    public promedio_total_recargas_avantel: number = 0;
    public promedio_total_recargas_paquetes_avantel: number = 0;
    public promedio_total_recargas_virgin: number = 0;
    public promedio_total_recargas_paquetes_virgin: number = 0;
    public promedio_total_recargas_paquete_etb: number = 0;
    public promedio_total_recargas_etb: number = 0;
    public promedio_total_recargas_exito: number = 0;
    public promedio_total_recargas_paquetes_exito: number = 0;
    public promedio_total_recargas_paquetes_conectame: number = 0;
    public promedio_total_recargas_conectame: number = 0;
    public promedio_total_recargas_sipmobile: number = 0;
    public promedio_total_recargas_flashmobile: number = 0;
    public promedio_total_recargas_directv: number = 0;
    public promedio_total_recargas_iyo_movil: number = 0;
    public promedio_total_recargas_comunicamos: number = 0;
    public promedio_total_recargas_wom: number = 0;
    public promedio_total_recargas_paquetes_wom: number = 0;
    public promedio_total_recargas_kalley_mobile: number = 0;
    public promedio_total_recargas_paquetes_kalley: number = 0;
    public promedio_total_recargas_total: number = 0;


    constructor(private messageService: MessageService, private _recargasJVService: RecargasJVService) { }

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        this.getGanancias();
        this.getSaldos();
        this.getRecargas();
        this.getIndicadores();
    }

    getGanancias() {
        this.spinGanancias = true;
        this.listGanancias = [];
        this._recargasJVService.getGanancias().subscribe((data: any) => {
            this.spinGanancias = false;
            if (!data.bRta) return;
            this.listGanancias = data.data;
            this.listGanancias.forEach(element => {
                element.davivienda_pago_tarjeta_de_credito = Number(element.davivienda_pago_tarjeta_de_credito);
                element.davivienda_pago_de_credito = Number(element.davivienda_pago_de_credito);
                element.davivienda_deposito_davivienda = Number(element.davivienda_deposito_davivienda);
                element.davivienda_retiro_davivienda = Number(element.davivienda_retiro_davivienda);
                element.aval_tarjeta_de_credito_ban_bogota = Number(element.aval_tarjeta_de_credito_ban_bogota);
                element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = Number(element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota);
                element.aval_credito_hipotecario_ban_bogota = Number(element.aval_credito_hipotecario_ban_bogota);
                element.aval_otros_creditos_ban_bogota = Number(element.aval_otros_creditos_ban_bogota);
                element.aval_credito_motos_vehiculos_ban_bogota = Number(element.aval_credito_motos_vehiculos_ban_bogota);
                element.xbox_plata = Number(element.xbox_plata);
                element.imvu = Number(element.imvu);
                element.keo = Number(element.keo);
                element.sisteCredito = Number(element.sisteCredito);
                element.claro = Number(element.claro);
                element.paquetes_claro = Number(element.paquetes_claro);
                element.sura = Number(element.sura);
                element.movistar = Number(element.movistar);
                element.paquetes_movistar = Number(element.paquetes_movistar);
                element.tigo = Number(element.tigo);
                element.paquetes_tigo = Number(element.paquetes_tigo);
                element.avantel = Number(element.avantel);
                element.paquetes_avantel = Number(element.paquetes_avantel);
                element.virgin = Number(element.virgin);
                element.paquetes_virgin = Number(element.paquetes_virgin);
                element.etb = Number(element.etb);
                element.paquete_etb = Number(element.paquete_etb);
                element.exito = Number(element.exito);
                element.paquetes_exito = Number(element.paquetes_exito);
                element.paquetes_conectame = Number(element.paquetes_conectame);
                element.flashMobile = Number(element.flashMobile);
                element.direcTv = Number(element.direcTv);
                element.wom = Number(element.wom);
                element.paquetes_wom = Number(element.paquetes_wom);
                element.kalley_mobile = Number(element.kalley_mobile);
                element.paquetes_kalley_mobile = Number(element.paquetes_kalley_mobile);
                element.wings_mobile = Number(element.wings_mobile);
                element.paquetes_wings_mobile = Number(element.paquetes_wings_mobile);
                element.unicorn = Number(element.unicorn);
                element.wplay = Number(element.wplay);
                element.mega_apuesta = Number(element.mega_apuesta);
                element.ya_juego = Number(element.ya_juego);
                element.aqui_juego = Number(element.aqui_juego);
                element.rushBet = Number(element.rushBet);
                element.rivalo = Number(element.rivalo);
                element.miJugada = Number(element.miJugada);
                element.facturas_otros = Number(element.facturas_otros);
                element.facturas_de_gas_energia = Number(element.facturas_de_gas_energia);
                element.sms = Number(element.sms);
                element.baloto = Number(element.baloto);
                element.baloto_pago_de_premios = Number(element.baloto_pago_de_premios);
                element.certificado_de_tradicion = Number(element.certificado_de_tradicion);
                element.runt = Number(element.runt);
                element.energia_prepago_essa = Number(element.energia_prepago_essa);
                element.energia_Prepago_epm = Number(element.energia_Prepago_epm);
                element.soat_moto_estado = Number(element.soat_moto_estado);
                element.soat_carro_estado = Number(element.soat_carro_estado);
                element.soat_bus_estado = Number(element.soat_bus_estado);
                element.axa_soat_moto = Number(element.axa_soat_moto);
                element.axa_soat_carro = Number(element.axa_soat_carro);
                element.axa_soat_publico = Number(element.axa_soat_publico);
                element.movii_recargas = Number(element.movii_recargas);
                element.movii_retiros = Number(element.movii_retiros);
                element.daviplata_recargas = Number(element.daviplata_recargas);
                element.daviplata_retiros = Number(element.daviplata_retiros);
                element.taxia_recargas = Number(element.taxia_recargas);
                element.tpaga_retiros = Number(element.tpaga_retiros);
                element.razer_gold = Number(element.razer_gold);
                element.netflix = Number(element.netflix);
                element.spotify = Number(element.spotify);
                element.payValida = Number(element.payValida);
                element.freeFire = Number(element.freeFire);
                element.noggin = Number(element.noggin);
                element.crunchyroll = Number(element.crunchyroll);
                element.office = Number(element.office);
                element.win_sport = Number(element.win_sport);
                element.dataCredito = Number(element.dataCredito);
                element.paramount = Number(element.paramount);
                element.xbox_suscripciones = Number(element.xbox_suscripciones);
                element.play_station = Number(element.play_station);
                element.play_station_suscripciones = Number(element.play_station_suscripciones);
                element.minecraft = Number(element.minecraft);
                element.rixty = Number(element.rixty);
                element.payCash = Number(element.payCash);
                element.total = Number(element.total);
            });
        })
    }

    getSaldos() {
        this.spinSaldo = true;
        this.listSaldo = [];
        this._recargasJVService.getSaldos().subscribe((data: any) => {
            this.spinSaldo = false;
            if (!data.bRta) return;
            this.listSaldo = data.data;
            this.listSaldo.forEach(element => {
                element.davivienda_pago_tarjeta_de_credito = Number(element.davivienda_pago_tarjeta_de_credito);
                element.davivienda_pago_de_credito = Number(element.davivienda_pago_de_credito);
                element.davivienda_deposito_davivienda = Number(element.davivienda_deposito_davivienda);
                element.davivienda_retiro_davivienda = Number(element.davivienda_retiro_davivienda);
                element.aval_tarjeta_de_credito_ban_bogota = Number(element.aval_tarjeta_de_credito_ban_bogota);
                element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = Number(element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota);
                element.aval_credito_hipotecario_ban_bogota = Number(element.aval_credito_hipotecario_ban_bogota);
                element.aval_otros_creditos_ban_bogota = Number(element.aval_otros_creditos_ban_bogota);
                element.aval_credito_motos_vehiculos_ban_bogota = Number(element.aval_credito_motos_vehiculos_ban_bogota);
                element.xbox_plata = Number(element.xbox_plata);
                element.imvu = Number(element.imvu);
                element.keo = Number(element.keo);
                element.sisteCredito = Number(element.sisteCredito);
                element.claro = Number(element.claro);
                element.paquetes_claro = Number(element.paquetes_claro);
                element.sura = Number(element.sura);
                element.movistar = Number(element.movistar);
                element.paquetes_movistar = Number(element.paquetes_movistar);
                element.tigo = Number(element.tigo);
                element.paquetes_tigo = Number(element.paquetes_tigo);
                element.avantel = Number(element.avantel);
                element.paquetes_avantel = Number(element.paquetes_avantel);
                element.virgin = Number(element.virgin);
                element.paquetes_virgin = Number(element.paquetes_virgin);
                element.etb = Number(element.etb);
                element.paquete_etb = Number(element.paquete_etb);
                element.exito = Number(element.exito);
                element.paquetes_exito = Number(element.paquetes_exito);
                element.paquetes_conectame = Number(element.paquetes_conectame);
                element.flashMobile = Number(element.flashMobile);
                element.direcTv = Number(element.direcTv);
                element.wom = Number(element.wom);
                element.paquetes_wom = Number(element.paquetes_wom);
                element.kalley_mobile = Number(element.kalley_mobile);
                element.paquetes_kalley_mobile = Number(element.paquetes_kalley_mobile);
                element.wings_mobile = Number(element.wings_mobile);
                element.paquetes_wings_mobile = Number(element.paquetes_wings_mobile);
                element.unicorn = Number(element.unicorn);
                element.wplay = Number(element.wplay);
                element.mega_apuesta = Number(element.mega_apuesta);
                element.ya_juego = Number(element.ya_juego);
                element.aqui_juego = Number(element.aqui_juego);
                element.rushBet = Number(element.rushBet);
                element.rivalo = Number(element.rivalo);
                element.miJugada = Number(element.miJugada);
                element.facturas_otros = Number(element.facturas_otros);
                element.facturas_de_gas_energia = Number(element.facturas_de_gas_energia);
                element.sms = Number(element.sms);
                element.baloto = Number(element.baloto);
                element.baloto_pago_de_premios = Number(element.baloto_pago_de_premios);
                element.certificado_de_tradicion = Number(element.certificado_de_tradicion);
                element.runt = Number(element.runt);
                element.energia_prepago_essa = Number(element.energia_prepago_essa);
                element.energia_Prepago_epm = Number(element.energia_Prepago_epm);
                element.soat_moto_estado = Number(element.soat_moto_estado);
                element.soat_carro_estado = Number(element.soat_carro_estado);
                element.soat_bus_estado = Number(element.soat_bus_estado);
                element.axa_soat_moto = Number(element.axa_soat_moto);
                element.axa_soat_carro = Number(element.axa_soat_carro);
                element.axa_soat_publico = Number(element.axa_soat_publico);
                element.movii_recargas = Number(element.movii_recargas);
                element.movii_retiros = Number(element.movii_retiros);
                element.daviplata_recargas = Number(element.daviplata_recargas);
                element.daviplata_retiros = Number(element.daviplata_retiros);
                element.taxia_recargas = Number(element.taxia_recargas);
                element.tpaga_retiros = Number(element.tpaga_retiros);
                element.razer_gold = Number(element.razer_gold);
                element.netflix = Number(element.netflix);
                element.spotify = Number(element.spotify);
                element.payValida = Number(element.payValida);
                element.freeFire = Number(element.freeFire);
                element.noggin = Number(element.noggin);
                element.crunchyroll = Number(element.crunchyroll);
                element.office = Number(element.office);
                element.win_sport = Number(element.win_sport);
                element.dataCredito = Number(element.dataCredito);
                element.paramount = Number(element.paramount);
                element.xbox_suscripciones = Number(element.xbox_suscripciones);
                element.play_station = Number(element.play_station);
                element.play_station_suscripciones = Number(element.play_station_suscripciones);
                element.minecraft = Number(element.minecraft);
                element.rixty = Number(element.rixty);
                element.payCash = Number(element.payCash);
                element.total = Number(element.total);
            });
        })
    }

    getRecargas() {
        this.spinRecargas = true;
        this.listRecargas = [];
        this._recargasJVService.getRecargas().subscribe((data: any) => {
            this.spinRecargas = false;
            if (!data.bRta) return;
            this.listRecargas = data.data;
            this.listRecargas.forEach(element => {
                element.ayudas_a_familias = Number(element.ayudas_a_familias);
                element.claro = Number(element.claro);
                element.paquetes_claro = Number(element.paquetes_claro);
                element.paquetes_movistar = Number(element.paquetes_movistar);
                element.movistar = Number(element.movistar);
                element.paquetes_tigo = Number(element.paquetes_tigo);
                element.tigo = Number(element.tigo);
                element.avantel = Number(element.avantel);
                element.paquetes_avantel = Number(element.paquetes_avantel);
                element.virgin = Number(element.virgin);
                element.paquetes_virgin = Number(element.paquetes_virgin);
                element.paquete_etb = Number(element.paquete_etb);
                element.etb = Number(element.etb);
                element.exito = Number(element.exito);
                element.paquetes_exito = Number(element.paquetes_exito);
                element.paquetes_conectame = Number(element.paquetes_conectame);
                element.conectame = Number(element.conectame);
                element.sipmobile = Number(element.sipmobile);
                element.flashmobile = Number(element.flashmobile);
                element.directv = Number(element.directv);
                element.iyo_movil = Number(element.iyo_movil);
                element.comunicamos = Number(element.comunicamos);
                element.wom = Number(element.wom);
                element.paquetes_wom = Number(element.paquetes_wom);
                element.kalley_mobile = Number(element.kalley_mobile);
                element.paquetes_kalley = Number(element.paquetes_kalley);
            });
        })
    }

    getIndicadores() {
        this.spinIndicadores = true;
        this.listIndicadores = [];
        this._recargasJVService.getIndicadores().subscribe((data: any) => {
            this.spinIndicadores = false;
            if (!data.bRta) return;
            this.listIndicadores = data.data;
            this.listIndicadores.forEach(element => {
                element.ganancias = Number(element.ganancias);
                element.saldos = Number(element.saldos);
                element.recargas = Number(element.recargas);
            });
        })
    }

    //Fechas
    getGananciasFechas() {
        let fechaInicial = this.rangoFechasGanancias[0] != null ? this.formatDate(this.rangoFechasGanancias[0]) : null;
        let fechaFinal = this.rangoFechasGanancias[1] != null ? this.formatDate(this.rangoFechasGanancias[1]) : null;
        if (fechaInicial == null) {
            return;
        };
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.spinGanancias = true;
        this.listGanancias = [];
        this._recargasJVService.getGananciasFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinGanancias = false;
            if (!data.bRta) return;
            this.listGanancias = data.data;
            this.listGanancias.forEach(element => {
                element.davivienda_pago_tarjeta_de_credito = Number(element.davivienda_pago_tarjeta_de_credito);
                element.davivienda_pago_de_credito = Number(element.davivienda_pago_de_credito);
                element.davivienda_deposito_davivienda = Number(element.davivienda_deposito_davivienda);
                element.davivienda_retiro_davivienda = Number(element.davivienda_retiro_davivienda);
                element.aval_tarjeta_de_credito_ban_bogota = Number(element.aval_tarjeta_de_credito_ban_bogota);
                element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = Number(element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota);
                element.aval_credito_hipotecario_ban_bogota = Number(element.aval_credito_hipotecario_ban_bogota);
                element.aval_otros_creditos_ban_bogota = Number(element.aval_otros_creditos_ban_bogota);
                element.aval_credito_motos_vehiculos_ban_bogota = Number(element.aval_credito_motos_vehiculos_ban_bogota);
                element.xbox_plata = Number(element.xbox_plata);
                element.imvu = Number(element.imvu);
                element.keo = Number(element.keo);
                element.sisteCredito = Number(element.sisteCredito);
                element.claro = Number(element.claro);
                element.paquetes_claro = Number(element.paquetes_claro);
                element.sura = Number(element.sura);
                element.movistar = Number(element.movistar);
                element.paquetes_movistar = Number(element.paquetes_movistar);
                element.tigo = Number(element.tigo);
                element.paquetes_tigo = Number(element.paquetes_tigo);
                element.avantel = Number(element.avantel);
                element.paquetes_avantel = Number(element.paquetes_avantel);
                element.virgin = Number(element.virgin);
                element.paquetes_virgin = Number(element.paquetes_virgin);
                element.etb = Number(element.etb);
                element.paquete_etb = Number(element.paquete_etb);
                element.exito = Number(element.exito);
                element.paquetes_exito = Number(element.paquetes_exito);
                element.paquetes_conectame = Number(element.paquetes_conectame);
                element.flashMobile = Number(element.flashMobile);
                element.direcTv = Number(element.direcTv);
                element.wom = Number(element.wom);
                element.paquetes_wom = Number(element.paquetes_wom);
                element.kalley_mobile = Number(element.kalley_mobile);
                element.paquetes_kalley_mobile = Number(element.paquetes_kalley_mobile);
                element.wings_mobile = Number(element.wings_mobile);
                element.paquetes_wings_mobile = Number(element.paquetes_wings_mobile);
                element.unicorn = Number(element.unicorn);
                element.wplay = Number(element.wplay);
                element.mega_apuesta = Number(element.mega_apuesta);
                element.ya_juego = Number(element.ya_juego);
                element.aqui_juego = Number(element.aqui_juego);
                element.rushBet = Number(element.rushBet);
                element.rivalo = Number(element.rivalo);
                element.miJugada = Number(element.miJugada);
                element.facturas_otros = Number(element.facturas_otros);
                element.facturas_de_gas_energia = Number(element.facturas_de_gas_energia);
                element.sms = Number(element.sms);
                element.baloto = Number(element.baloto);
                element.baloto_pago_de_premios = Number(element.baloto_pago_de_premios);
                element.certificado_de_tradicion = Number(element.certificado_de_tradicion);
                element.runt = Number(element.runt);
                element.energia_prepago_essa = Number(element.energia_prepago_essa);
                element.energia_Prepago_epm = Number(element.energia_Prepago_epm);
                element.soat_moto_estado = Number(element.soat_moto_estado);
                element.soat_carro_estado = Number(element.soat_carro_estado);
                element.soat_bus_estado = Number(element.soat_bus_estado);
                element.axa_soat_moto = Number(element.axa_soat_moto);
                element.axa_soat_carro = Number(element.axa_soat_carro);
                element.axa_soat_publico = Number(element.axa_soat_publico);
                element.movii_recargas = Number(element.movii_recargas);
                element.movii_retiros = Number(element.movii_retiros);
                element.daviplata_recargas = Number(element.daviplata_recargas);
                element.daviplata_retiros = Number(element.daviplata_retiros);
                element.taxia_recargas = Number(element.taxia_recargas);
                element.tpaga_retiros = Number(element.tpaga_retiros);
                element.razer_gold = Number(element.razer_gold);
                element.netflix = Number(element.netflix);
                element.spotify = Number(element.spotify);
                element.payValida = Number(element.payValida);
                element.freeFire = Number(element.freeFire);
                element.noggin = Number(element.noggin);
                element.crunchyroll = Number(element.crunchyroll);
                element.office = Number(element.office);
                element.win_sport = Number(element.win_sport);
                element.dataCredito = Number(element.dataCredito);
                element.paramount = Number(element.paramount);
                element.xbox_suscripciones = Number(element.xbox_suscripciones);
                element.play_station = Number(element.play_station);
                element.play_station_suscripciones = Number(element.play_station_suscripciones);
                element.minecraft = Number(element.minecraft);
                element.rixty = Number(element.rixty);
                element.payCash = Number(element.payCash);
                element.total = Number(element.total);
            });
        })
    }

    getSaldosFechas() {
        let fechaInicial = this.rangoFechasSaldos[0] != null ? this.formatDate(this.rangoFechasSaldos[0]) : null;
        let fechaFinal = this.rangoFechasSaldos[1] != null ? this.formatDate(this.rangoFechasSaldos[1]) : null;
        if (fechaInicial == null) {
            return;
        };
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.spinSaldo = true;
        this.listSaldo = [];
        this._recargasJVService.getSaldosFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinSaldo = false;
            if (!data.bRta) return;
            this.listSaldo = data.data;
            this.listSaldo.forEach(element => {
                element.davivienda_pago_tarjeta_de_credito = Number(element.davivienda_pago_tarjeta_de_credito);
                element.davivienda_pago_de_credito = Number(element.davivienda_pago_de_credito);
                element.davivienda_deposito_davivienda = Number(element.davivienda_deposito_davivienda);
                element.davivienda_retiro_davivienda = Number(element.davivienda_retiro_davivienda);
                element.aval_tarjeta_de_credito_ban_bogota = Number(element.aval_tarjeta_de_credito_ban_bogota);
                element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = Number(element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota);
                element.aval_credito_hipotecario_ban_bogota = Number(element.aval_credito_hipotecario_ban_bogota);
                element.aval_otros_creditos_ban_bogota = Number(element.aval_otros_creditos_ban_bogota);
                element.aval_credito_motos_vehiculos_ban_bogota = Number(element.aval_credito_motos_vehiculos_ban_bogota);
                element.xbox_plata = Number(element.xbox_plata);
                element.imvu = Number(element.imvu);
                element.keo = Number(element.keo);
                element.sisteCredito = Number(element.sisteCredito);
                element.claro = Number(element.claro);
                element.paquetes_claro = Number(element.paquetes_claro);
                element.sura = Number(element.sura);
                element.movistar = Number(element.movistar);
                element.paquetes_movistar = Number(element.paquetes_movistar);
                element.tigo = Number(element.tigo);
                element.paquetes_tigo = Number(element.paquetes_tigo);
                element.avantel = Number(element.avantel);
                element.paquetes_avantel = Number(element.paquetes_avantel);
                element.virgin = Number(element.virgin);
                element.paquetes_virgin = Number(element.paquetes_virgin);
                element.etb = Number(element.etb);
                element.paquete_etb = Number(element.paquete_etb);
                element.exito = Number(element.exito);
                element.paquetes_exito = Number(element.paquetes_exito);
                element.paquetes_conectame = Number(element.paquetes_conectame);
                element.flashMobile = Number(element.flashMobile);
                element.direcTv = Number(element.direcTv);
                element.wom = Number(element.wom);
                element.paquetes_wom = Number(element.paquetes_wom);
                element.kalley_mobile = Number(element.kalley_mobile);
                element.paquetes_kalley_mobile = Number(element.paquetes_kalley_mobile);
                element.wings_mobile = Number(element.wings_mobile);
                element.paquetes_wings_mobile = Number(element.paquetes_wings_mobile);
                element.unicorn = Number(element.unicorn);
                element.wplay = Number(element.wplay);
                element.mega_apuesta = Number(element.mega_apuesta);
                element.ya_juego = Number(element.ya_juego);
                element.aqui_juego = Number(element.aqui_juego);
                element.rushBet = Number(element.rushBet);
                element.rivalo = Number(element.rivalo);
                element.miJugada = Number(element.miJugada);
                element.facturas_otros = Number(element.facturas_otros);
                element.facturas_de_gas_energia = Number(element.facturas_de_gas_energia);
                element.sms = Number(element.sms);
                element.baloto = Number(element.baloto);
                element.baloto_pago_de_premios = Number(element.baloto_pago_de_premios);
                element.certificado_de_tradicion = Number(element.certificado_de_tradicion);
                element.runt = Number(element.runt);
                element.energia_prepago_essa = Number(element.energia_prepago_essa);
                element.energia_Prepago_epm = Number(element.energia_Prepago_epm);
                element.soat_moto_estado = Number(element.soat_moto_estado);
                element.soat_carro_estado = Number(element.soat_carro_estado);
                element.soat_bus_estado = Number(element.soat_bus_estado);
                element.axa_soat_moto = Number(element.axa_soat_moto);
                element.axa_soat_carro = Number(element.axa_soat_carro);
                element.axa_soat_publico = Number(element.axa_soat_publico);
                element.movii_recargas = Number(element.movii_recargas);
                element.movii_retiros = Number(element.movii_retiros);
                element.daviplata_recargas = Number(element.daviplata_recargas);
                element.daviplata_retiros = Number(element.daviplata_retiros);
                element.taxia_recargas = Number(element.taxia_recargas);
                element.tpaga_retiros = Number(element.tpaga_retiros);
                element.razer_gold = Number(element.razer_gold);
                element.netflix = Number(element.netflix);
                element.spotify = Number(element.spotify);
                element.payValida = Number(element.payValida);
                element.freeFire = Number(element.freeFire);
                element.noggin = Number(element.noggin);
                element.crunchyroll = Number(element.crunchyroll);
                element.office = Number(element.office);
                element.win_sport = Number(element.win_sport);
                element.dataCredito = Number(element.dataCredito);
                element.paramount = Number(element.paramount);
                element.xbox_suscripciones = Number(element.xbox_suscripciones);
                element.play_station = Number(element.play_station);
                element.play_station_suscripciones = Number(element.play_station_suscripciones);
                element.minecraft = Number(element.minecraft);
                element.rixty = Number(element.rixty);
                element.payCash = Number(element.payCash);
                element.total = Number(element.total);
            });
        })
    }

    getRecargasFechas() {
        let fechaInicial = this.rangoFechasRecargas[0] != null ? this.formatDate(this.rangoFechasRecargas[0]) : null;
        let fechaFinal = this.rangoFechasRecargas[1] != null ? this.formatDate(this.rangoFechasRecargas[1]) : null;
        if (fechaInicial == null) {
            return;
        };
        if (fechaFinal == null) fechaFinal = fechaInicial;
        this.spinRecargas = true;
        this.listRecargas = [];
        this._recargasJVService.getRecargasFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinRecargas = false;
            if (!data.bRta) return;
            this.listRecargas = data.data;
            this.listRecargas.forEach(element => {
                element.ayudas_a_familias = Number(element.ayudas_a_familias);
                element.claro = Number(element.claro);
                element.paquetes_claro = Number(element.paquetes_claro);
                element.paquetes_movistar = Number(element.paquetes_movistar);
                element.movistar = Number(element.movistar);
                element.paquetes_tigo = Number(element.paquetes_tigo);
                element.tigo = Number(element.tigo);
                element.avantel = Number(element.avantel);
                element.paquetes_avantel = Number(element.paquetes_avantel);
                element.virgin = Number(element.virgin);
                element.paquetes_virgin = Number(element.paquetes_virgin);
                element.paquete_etb = Number(element.paquete_etb);
                element.etb = Number(element.etb);
                element.exito = Number(element.exito);
                element.paquetes_exito = Number(element.paquetes_exito);
                element.paquetes_conectame = Number(element.paquetes_conectame);
                element.conectame = Number(element.conectame);
                element.sipmobile = Number(element.sipmobile);
                element.flashmobile = Number(element.flashmobile);
                element.directv = Number(element.directv);
                element.iyo_movil = Number(element.iyo_movil);
                element.comunicamos = Number(element.comunicamos);
                element.wom = Number(element.wom);
                element.paquetes_wom = Number(element.paquetes_wom);
                element.kalley_mobile = Number(element.kalley_mobile);
                element.paquetes_kalley = Number(element.paquetes_kalley);
            });
        })
    }

    getIndicadoresFechas() {
        let fechaInicial = this.rangoFechasIndicadores[0] != null ? this.formatDate(this.rangoFechasIndicadores[0]) : null;
        let fechaFinal = this.rangoFechasIndicadores[1] != null ? this.formatDate(this.rangoFechasIndicadores[1]) : null;
        if (fechaInicial == null) {
            return;
        };
        if (fechaFinal == null) fechaFinal = fechaInicial;

        this.spinIndicadores = true;
        this.listIndicadores = [];
        this._recargasJVService.getIndicadoresFecha(fechaInicial, fechaFinal).subscribe((data: any) => {
            this.spinIndicadores = false;
            if (!data.bRta) return;
            this.listIndicadores = data.data;
            this.listIndicadores.forEach(element => {
                element.ganancias = Number(element.ganancias);
                element.saldos = Number(element.saldos);
                element.recargas = Number(element.recargas);
            });
        })
    }

    //CArgue de información
    async onUpload(event, typeFile) {
        switch (typeFile) {
            case "ganancias":
                for (const file of event.files) {
                    this.uploadedFilesGanancias.push(file);
                }
                this.readExcelGanancias();
                this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Archivo procesado correctamente' });
                break;
            case "recargas":
                for (const file of event.files) {
                    this.uploadedFilesRecargas.push(file);
                }
                this.readCsvRecargas();
                this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Archivo procesado correctamente' });
                break;
            case "saldo":
                for (const file of event.files) {
                    this.uploadedFilesSaldo.push(file);
                }
                this.readExcelSaldo();
                this.messageService.add({ severity: 'info', summary: 'Correcto', detail: 'Archivo procesado correctamente' });
                break;

            default:
                break;
        }
        this.initData();
    }

    async readExcelGanancias() {
        this.listGanancias = [];
        for (const element of this.uploadedFilesGanancias) {
            await readXlsxFile(element).then((rows) => {
                let fechaCargue = '';
                for (const element2 of rows) {
                    if (element2[0] == 'Generado desde el') {
                        fechaCargue = element2[1] + "";
                        continue;
                    }
                    if (element2[0] == 'Nombre') continue;

                    let data: JV_Consumido_Ganancias = {
                        fecha_cargue: fechaCargue,
                        nombre: element2[0] + "",
                        codigo_cliente: element2[1] + "",
                        cc: element2[2] + "",
                        perfil: element2[3] + "",
                        davivienda_pago_tarjeta_de_credito: Number(element2[4]),
                        davivienda_pago_de_credito: Number(element2[5]),
                        davivienda_deposito_davivienda: Number(element2[6]),
                        davivienda_retiro_davivienda: Number(element2[7]),
                        aval_tarjeta_de_credito_ban_bogota: Number(element2[8]),
                        aval_cred_rotativo_crediservices_dinero_extra_ban_bogota: Number(element2[9]),
                        aval_credito_hipotecario_ban_bogota: Number(element2[10]),
                        aval_otros_creditos_ban_bogota: Number(element2[11]),
                        aval_credito_motos_vehiculos_ban_bogota: Number(element2[12]),
                        xbox_plata: Number(element2[13]),
                        imvu: Number(element2[14]),
                        keo: Number(element2[15]),
                        sisteCredito: Number(element2[16]),
                        claro: Number(element2[17]),
                        paquetes_claro: Number(element2[18]),
                        sura: Number(element2[19]),
                        movistar: Number(element2[20]),
                        paquetes_movistar: Number(element2[21]),
                        tigo: Number(element2[22]),
                        paquetes_tigo: Number(element2[23]),
                        avantel: Number(element2[24]),
                        paquetes_avantel: Number(element2[25]),
                        virgin: Number(element2[26]),
                        paquetes_virgin: Number(element2[27]),
                        etb: Number(element2[28]),
                        paquete_etb: Number(element2[29]),
                        exito: Number(element2[30]),
                        paquetes_exito: Number(element2[31]),
                        paquetes_conectame: Number(element2[32]),
                        flashMobile: Number(element2[33]),
                        direcTv: Number(element2[34]),
                        wom: Number(element2[35]),
                        paquetes_wom: Number(element2[36]),
                        kalley_mobile: Number(element2[37]),
                        paquetes_kalley_mobile: Number(element2[38]),
                        wings_mobile: Number(element2[39]),
                        paquetes_wings_mobile: Number(element2[40]),
                        unicorn: Number(element2[41]),
                        wplay: Number(element2[42]),
                        mega_apuesta: Number(element2[43]),
                        ya_juego: Number(element2[44]),
                        aqui_juego: Number(element2[45]),
                        rushBet: Number(element2[46]),
                        rivalo: Number(element2[47]),
                        miJugada: Number(element2[48]),
                        facturas_otros: Number(element2[49]),
                        facturas_de_gas_energia: Number(element2[50]),
                        sms: Number(element2[51]),
                        baloto: Number(element2[52]),
                        baloto_pago_de_premios: Number(element2[53]),
                        certificado_de_tradicion: Number(element2[54]),
                        runt: Number(element2[55]),
                        energia_prepago_essa: Number(element2[56]),
                        energia_Prepago_epm: Number(element2[57]),
                        soat_moto_estado: Number(element2[58]),
                        soat_carro_estado: Number(element2[59]),
                        soat_bus_estado: Number(element2[60]),
                        axa_soat_moto: Number(element2[61]),
                        axa_soat_carro: Number(element2[62]),
                        axa_soat_publico: Number(element2[63]),
                        movii_recargas: Number(element2[64]),
                        movii_retiros: Number(element2[65]),
                        daviplata_recargas: Number(element2[66]),
                        daviplata_retiros: Number(element2[67]),
                        taxia_recargas: Number(element2[68]),
                        tpaga_retiros: Number(element2[69]),
                        razer_gold: Number(element2[70]),
                        netflix: Number(element2[71]),
                        spotify: Number(element2[72]),
                        payValida: Number(element2[73]),
                        freeFire: Number(element2[74]),
                        noggin: Number(element2[75]),
                        crunchyroll: Number(element2[76]),
                        office: Number(element2[77]),
                        win_sport: Number(element2[78]),
                        dataCredito: Number(element2[79]),
                        paramount: Number(element2[80]),
                        xbox_suscripciones: Number(element2[81]),
                        play_station: Number(element2[82]),
                        play_station_suscripciones: Number(element2[83]),
                        minecraft: Number(element2[84]),
                        rixty: Number(element2[85]),
                        payCash: Number(element2[86]),
                        total: Number(element2[87]),
                    }
                    this.listNewGanancias.push(data);
                }
            })
        }
        await this.saveGanancias();
        this.initData();
    }

    async saveGanancias() {
        this.showProgressBarGanancias = true;
        let dataSubir = this.listNewGanancias.length;
        let contador = 1;
        for (const recarga of this.listNewGanancias) {
            await lastValueFrom(this._recargasJVService.nuevaGanancia(recarga)).then((data: any) => { });
            this.valueProgressBarGanancias = Math.round((contador * 100) / dataSubir);
            contador++;
        }
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se ha terminado el cargue de recargas' });
        this.showProgressBarGanancias = false;
        this.initData();
    }

    async readExcelSaldo() {
        this.listNewSaldo = [];
        for (const element of this.uploadedFilesSaldo) {
            await readXlsxFile(element).then((rows) => {
                let fechaCargue = '';
                for (const element2 of rows) {
                    if (element2[0] == 'Generado desde el') {
                        fechaCargue = element2[1] + "";
                        continue;
                    }
                    if (element2[0] == 'Nombre') continue;
                    let data: JV_Consumido_Saldo = {
                        fecha_cargue: fechaCargue,
                        nombre: element2[0] + "",
                        codigo_cliente: element2[1] + "",
                        cc: element2[2] + "",
                        perfil: element2[3] + "",
                        davivienda_pago_tarjeta_de_credito: Number(element2[4]),
                        davivienda_pago_de_credito: Number(element2[5]),
                        davivienda_deposito_davivienda: Number(element2[6]),
                        davivienda_retiro_davivienda: Number(element2[7]),
                        aval_tarjeta_de_credito_ban_bogota: Number(element2[8]),
                        aval_cred_rotativo_crediservices_dinero_extra_ban_bogota: Number(element2[9]),
                        aval_credito_hipotecario_ban_bogota: Number(element2[10]),
                        aval_otros_creditos_ban_bogota: Number(element2[11]),
                        aval_credito_motos_vehiculos_ban_bogota: Number(element2[12]),
                        xbox_plata: Number(element2[13]),
                        imvu: Number(element2[14]),
                        keo: Number(element2[15]),
                        sisteCredito: Number(element2[16]),
                        claro: Number(element2[17]),
                        paquetes_claro: Number(element2[18]),
                        sura: Number(element2[19]),
                        movistar: Number(element2[20]),
                        paquetes_movistar: Number(element2[21]),
                        tigo: Number(element2[22]),
                        paquetes_tigo: Number(element2[23]),
                        avantel: Number(element2[24]),
                        paquetes_avantel: Number(element2[25]),
                        virgin: Number(element2[26]),
                        paquetes_virgin: Number(element2[27]),
                        etb: Number(element2[28]),
                        paquete_etb: Number(element2[29]),
                        exito: Number(element2[30]),
                        paquetes_exito: Number(element2[31]),
                        paquetes_conectame: Number(element2[32]),
                        flashMobile: Number(element2[33]),
                        direcTv: Number(element2[34]),
                        wom: Number(element2[35]),
                        paquetes_wom: Number(element2[36]),
                        kalley_mobile: Number(element2[37]),
                        paquetes_kalley_mobile: Number(element2[38]),
                        wings_mobile: Number(element2[39]),
                        paquetes_wings_mobile: Number(element2[40]),
                        unicorn: Number(element2[41]),
                        wplay: Number(element2[42]),
                        mega_apuesta: Number(element2[43]),
                        ya_juego: Number(element2[44]),
                        aqui_juego: Number(element2[45]),
                        rushBet: Number(element2[46]),
                        rivalo: Number(element2[47]),
                        miJugada: Number(element2[48]),
                        facturas_otros: Number(element2[49]),
                        facturas_de_gas_energia: Number(element2[50]),
                        sms: Number(element2[51]),
                        baloto: Number(element2[52]),
                        baloto_pago_de_premios: Number(element2[53]),
                        certificado_de_tradicion: Number(element2[54]),
                        runt: Number(element2[55]),
                        energia_prepago_essa: Number(element2[56]),
                        energia_Prepago_epm: Number(element2[57]),
                        soat_moto_estado: Number(element2[58]),
                        soat_carro_estado: Number(element2[59]),
                        soat_bus_estado: Number(element2[60]),
                        axa_soat_moto: Number(element2[61]),
                        axa_soat_carro: Number(element2[62]),
                        axa_soat_publico: Number(element2[63]),
                        movii_recargas: Number(element2[64]),
                        movii_retiros: Number(element2[65]),
                        daviplata_recargas: Number(element2[66]),
                        daviplata_retiros: Number(element2[67]),
                        taxia_recargas: Number(element2[68]),
                        tpaga_retiros: Number(element2[69]),
                        razer_gold: Number(element2[70]),
                        netflix: Number(element2[71]),
                        spotify: Number(element2[72]),
                        payValida: Number(element2[73]),
                        freeFire: Number(element2[74]),
                        noggin: Number(element2[75]),
                        crunchyroll: Number(element2[76]),
                        office: Number(element2[77]),
                        win_sport: Number(element2[78]),
                        dataCredito: Number(element2[79]),
                        paramount: Number(element2[80]),
                        xbox_suscripciones: Number(element2[81]),
                        play_station: Number(element2[82]),
                        play_station_suscripciones: Number(element2[83]),
                        minecraft: Number(element2[84]),
                        rixty: Number(element2[85]),
                        payCash: Number(element2[86]),
                        total: Number(element2[87]),
                    }
                    this.listNewSaldo.push(data);
                }
            })
        }
        await this.saveSaldos();
        this.initData();
    }

    async saveSaldos() {
        this.showProgressBarSaldo = true;
        let dataSubir = this.listNewSaldo.length;
        let contador = 1;
        for (const recarga of this.listNewSaldo) {
            await lastValueFrom(this._recargasJVService.nuevoSaldo(recarga)).then((data: any) => { });
            this.valueProgressBarSaldo = Math.round((contador * 100) / dataSubir);
            contador++;
        }
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se ha terminado el cargue de recargas' });
        this.showProgressBarSaldo = false;
        this.initData();
    }

    async readCsvRecargas() {
        for (const element of this.uploadedFilesRecargas) {
            let reader = new FileReader();
            reader.readAsText(element);
            reader.onloadend = () => {
                let csvData = reader.result;
                let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
                let headers = this.getHeaderCsvRecargas(csvRecordsArray, 0);
                let headersNames = this.getHeaderCsvRecargas(csvRecordsArray, 1);
                this.listNewRecargas = this.getDataCsvRecargas(csvRecordsArray, headersNames.length, headers[1]);

            };
        }
        await this.timeout(200);
        this.saveRecargas();
    }

    async saveRecargas() {
        this.showProgressBarRecargas = true;
        let dataSubir = this.listNewRecargas.length;
        let contador = 1;
        for (const recarga of this.listNewRecargas) {
            await lastValueFrom(this._recargasJVService.nuevaRecarga(recarga)).then((data: any) => { });
            this.valueProgressBarRecargas = Math.round((contador * 100) / dataSubir);
            contador++;
        }
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se ha terminado el cargue de recargas' });
        this.showProgressBarRecargas = false;
        this.initData();
    }

    getHeaderCsvRecargas(csvRecordsArr: any, csvRow: number) {
        let headers = (<string>csvRecordsArr[csvRow]).split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    getDataCsvRecargas(csvRecordsArray: any, headerLength: number, date: string) {
        let csvArr = [];

        for (let i = 2; i < csvRecordsArray.length; i++) {
            let curruntRecord = (<string>csvRecordsArray[i]).split(',');
            if (curruntRecord.length == headerLength) {
                let csvRecord: JV_Consumido_Recargas = {
                    fecha_cargue: date,
                    nombre: curruntRecord[0].trim(),
                    codigo_cliente: curruntRecord[1].trim(),
                    cc: curruntRecord[2].trim(),
                    perfil: curruntRecord[3].trim(),
                    comision: curruntRecord[4].trim(),
                    ayudas_a_familias: Number(curruntRecord[5].trim()),
                    claro: Number(curruntRecord[6].trim()),
                    paquetes_claro: Number(curruntRecord[7].trim()),
                    paquetes_movistar: Number(curruntRecord[8].trim()),
                    movistar: Number(curruntRecord[9].trim()),
                    paquetes_tigo: Number(curruntRecord[10].trim()),
                    tigo: Number(curruntRecord[11].trim()),
                    avantel: Number(curruntRecord[12].trim()),
                    paquetes_avantel: Number(curruntRecord[13].trim()),
                    virgin: Number(curruntRecord[14].trim()),
                    paquetes_virgin: Number(curruntRecord[15].trim()),
                    paquete_etb: Number(curruntRecord[16].trim()),
                    etb: Number(curruntRecord[17].trim()),
                    exito: Number(curruntRecord[18].trim()),
                    paquetes_exito: Number(curruntRecord[19].trim()),
                    paquetes_conectame: Number(curruntRecord[20].trim()),
                    conectame: Number(curruntRecord[21].trim()),
                    sipmobile: Number(curruntRecord[22].trim()),
                    flashmobile: Number(curruntRecord[23].trim()),
                    directv: Number(curruntRecord[24].trim()),
                    iyo_movil: Number(curruntRecord[25].trim()),
                    comunicamos: Number(curruntRecord[26].trim()),
                    wom: Number(curruntRecord[27].trim()),
                    paquetes_wom: Number(curruntRecord[28].trim()),
                    kalley_mobile: Number(curruntRecord[29].trim()),
                    paquetes_kalley: Number(curruntRecord[30].trim()),
                    total: Number(curruntRecord[5].trim()) +
                        Number(curruntRecord[6].trim()) +
                        Number(curruntRecord[7].trim()) +
                        Number(curruntRecord[8].trim()) +
                        Number(curruntRecord[9].trim()) +
                        Number(curruntRecord[10].trim()) +
                        Number(curruntRecord[11].trim()) +
                        Number(curruntRecord[12].trim()) +
                        Number(curruntRecord[13].trim()) +
                        Number(curruntRecord[14].trim()) +
                        Number(curruntRecord[15].trim()) +
                        Number(curruntRecord[16].trim()) +
                        Number(curruntRecord[17].trim()) +
                        Number(curruntRecord[18].trim()) +
                        Number(curruntRecord[19].trim()) +
                        Number(curruntRecord[20].trim()) +
                        Number(curruntRecord[21].trim()) +
                        Number(curruntRecord[22].trim()) +
                        Number(curruntRecord[23].trim()) +
                        Number(curruntRecord[24].trim()) +
                        Number(curruntRecord[25].trim()) +
                        Number(curruntRecord[26].trim()) +
                        Number(curruntRecord[27].trim()) +
                        Number(curruntRecord[28].trim()) +
                        Number(curruntRecord[29].trim()) +
                        Number(curruntRecord[30].trim())
                };
                csvArr.push(csvRecord);
            }
        }
        return csvArr;
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //Filtro Ganancias
    filtroGanancias(event) {

        this.total_davivienda_pago_tarjeta_de_credito = 0;
        this.total_davivienda_pago_de_credito = 0;
        this.total_davivienda_deposito_davivienda = 0;
        this.total_davivienda_retiro_davivienda = 0;
        this.total_aval_tarjeta_de_credito_ban_bogota = 0;
        this.total_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = 0;
        this.total_aval_credito_hipotecario_ban_bogota = 0;
        this.total_aval_otros_creditos_ban_bogota = 0;
        this.total_aval_credito_motos_vehiculos_ban_bogota = 0;
        this.total_xbox_plata = 0;
        this.total_imvu = 0;
        this.total_keo = 0;
        this.total_sisteCredito = 0;
        this.total_claro = 0;
        this.total_paquetes_claro = 0;
        this.total_sura = 0;
        this.total_movistar = 0;
        this.total_paquetes_movistar = 0;
        this.total_tigo = 0;
        this.total_paquetes_tigo = 0;
        this.total_avantel = 0;
        this.total_paquetes_avantel = 0;
        this.total_virgin = 0;
        this.total_paquetes_virgin = 0;
        this.total_etb = 0;
        this.total_paquete_etb = 0;
        this.total_exito = 0;
        this.total_paquetes_exito = 0;
        this.total_paquetes_conectame = 0;
        this.total_flashMobile = 0;
        this.total_direcTv = 0;
        this.total_wom = 0;
        this.total_paquetes_wom = 0;
        this.total_kalley_mobile = 0;
        this.total_paquetes_kalley_mobile = 0;
        this.total_wings_mobile = 0;
        this.total_paquetes_wings_mobile = 0;
        this.total_unicorn = 0;
        this.total_wplay = 0;
        this.total_mega_apuesta = 0;
        this.total_ya_juego = 0;
        this.total_aqui_juego = 0;
        this.total_rushBet = 0;
        this.total_rivalo = 0;
        this.total_miJugada = 0;
        this.total_facturas_otros = 0;
        this.total_facturas_de_gas_energia = 0;
        this.total_sms = 0;
        this.total_baloto = 0;
        this.total_baloto_pago_de_premios = 0;
        this.total_certificado_de_tradicion = 0;
        this.total_runt = 0;
        this.total_energia_prepago_essa = 0;
        this.total_energia_Prepago_epm = 0;
        this.total_soat_moto_estado = 0;
        this.total_soat_carro_estado = 0;
        this.total_soat_bus_estado = 0;
        this.total_axa_soat_moto = 0;
        this.total_axa_soat_carro = 0;
        this.total_axa_soat_publico = 0;
        this.total_movii_recargas = 0;
        this.total_movii_retiros = 0;
        this.total_daviplata_recargas = 0;
        this.total_daviplata_retiros = 0;
        this.total_taxia_recargas = 0;
        this.total_tpaga_retiros = 0;
        this.total_razer_gold = 0;
        this.total_netflix = 0;
        this.total_spotify = 0;
        this.total_payValida = 0;
        this.total_freeFire = 0;
        this.total_noggin = 0;
        this.total_crunchyroll = 0;
        this.total_office = 0;
        this.total_win_sport = 0;
        this.total_dataCredito = 0;
        this.total_paramount = 0;
        this.total_xbox_suscripciones = 0;
        this.total_play_station = 0;
        this.total_play_station_suscripciones = 0;
        this.total_minecraft = 0;
        this.total_rixty = 0;
        this.total_payCash = 0;
        this.total_total = 0;



        this.promedio_davivienda_pago_tarjeta_de_credito = 0;
        this.promedio_davivienda_pago_de_credito = 0;
        this.promedio_davivienda_deposito_davivienda = 0;
        this.promedio_davivienda_retiro_davivienda = 0;
        this.promedio_aval_tarjeta_de_credito_ban_bogota = 0;
        this.promedio_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = 0;
        this.promedio_aval_credito_hipotecario_ban_bogota = 0;
        this.promedio_aval_otros_creditos_ban_bogota = 0;
        this.promedio_aval_credito_motos_vehiculos_ban_bogota = 0;
        this.promedio_xbox_plata = 0;
        this.promedio_imvu = 0;
        this.promedio_keo = 0;
        this.promedio_sisteCredito = 0;
        this.promedio_claro = 0;
        this.promedio_paquetes_claro = 0;
        this.promedio_sura = 0;
        this.promedio_movistar = 0;
        this.promedio_paquetes_movistar = 0;
        this.promedio_tigo = 0;
        this.promedio_paquetes_tigo = 0;
        this.promedio_avantel = 0;
        this.promedio_paquetes_avantel = 0;
        this.promedio_virgin = 0;
        this.promedio_paquetes_virgin = 0;
        this.promedio_etb = 0;
        this.promedio_paquete_etb = 0;
        this.promedio_exito = 0;
        this.promedio_paquetes_exito = 0;
        this.promedio_paquetes_conectame = 0;
        this.promedio_flashMobile = 0;
        this.promedio_direcTv = 0;
        this.promedio_wom = 0;
        this.promedio_paquetes_wom = 0;
        this.promedio_kalley_mobile = 0;
        this.promedio_paquetes_kalley_mobile = 0;
        this.promedio_wings_mobile = 0;
        this.promedio_paquetes_wings_mobile = 0;
        this.promedio_unicorn = 0;
        this.promedio_wplay = 0;
        this.promedio_mega_apuesta = 0;
        this.promedio_ya_juego = 0;
        this.promedio_aqui_juego = 0;
        this.promedio_rushBet = 0;
        this.promedio_rivalo = 0;
        this.promedio_miJugada = 0;
        this.promedio_facturas_otros = 0;
        this.promedio_facturas_de_gas_energia = 0;
        this.promedio_sms = 0;
        this.promedio_baloto = 0;
        this.promedio_baloto_pago_de_premios = 0;
        this.promedio_certificado_de_tradicion = 0;
        this.promedio_runt = 0;
        this.promedio_energia_prepago_essa = 0;
        this.promedio_energia_Prepago_epm = 0;
        this.promedio_soat_moto_estado = 0;
        this.promedio_soat_carro_estado = 0;
        this.promedio_soat_bus_estado = 0;
        this.promedio_axa_soat_moto = 0;
        this.promedio_axa_soat_carro = 0;
        this.promedio_axa_soat_publico = 0;
        this.promedio_movii_recargas = 0;
        this.promedio_movii_retiros = 0;
        this.promedio_daviplata_recargas = 0;
        this.promedio_daviplata_retiros = 0;
        this.promedio_taxia_recargas = 0;
        this.promedio_tpaga_retiros = 0;
        this.promedio_razer_gold = 0;
        this.promedio_netflix = 0;
        this.promedio_spotify = 0;
        this.promedio_payValida = 0;
        this.promedio_freeFire = 0;
        this.promedio_noggin = 0;
        this.promedio_crunchyroll = 0;
        this.promedio_office = 0;
        this.promedio_win_sport = 0;
        this.promedio_dataCredito = 0;
        this.promedio_paramount = 0;
        this.promedio_xbox_suscripciones = 0;
        this.promedio_play_station = 0;
        this.promedio_play_station_suscripciones = 0;
        this.promedio_minecraft = 0;
        this.promedio_rixty = 0;
        this.promedio_payCash = 0;
        this.promedio_total = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.total_davivienda_pago_tarjeta_de_credito += Number(element.davivienda_pago_tarjeta_de_credito);
            this.total_davivienda_pago_de_credito += Number(element.davivienda_pago_de_credito);
            this.total_davivienda_deposito_davivienda += Number(element.davivienda_deposito_davivienda);
            this.total_davivienda_retiro_davivienda += Number(element.davivienda_retiro_davivienda);
            this.total_aval_tarjeta_de_credito_ban_bogota += Number(element.aval_tarjeta_de_credito_ban_bogota);
            this.total_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota += Number(element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota);
            this.total_aval_credito_hipotecario_ban_bogota += Number(element.aval_credito_hipotecario_ban_bogota);
            this.total_aval_otros_creditos_ban_bogota += Number(element.aval_otros_creditos_ban_bogota);
            this.total_aval_credito_motos_vehiculos_ban_bogota += Number(element.aval_credito_motos_vehiculos_ban_bogota);
            this.total_xbox_plata += Number(element.xbox_plata);
            this.total_imvu += Number(element.imvu);
            this.total_keo += Number(element.keo);
            this.total_sisteCredito += Number(element.sisteCredito);
            this.total_claro += Number(element.claro);
            this.total_paquetes_claro += Number(element.paquetes_claro);
            this.total_sura += Number(element.sura);
            this.total_movistar += Number(element.movistar);
            this.total_paquetes_movistar += Number(element.paquetes_movistar);
            this.total_tigo += Number(element.tigo);
            this.total_paquetes_tigo += Number(element.paquetes_tigo);
            this.total_avantel += Number(element.avantel);
            this.total_paquetes_avantel += Number(element.paquetes_avantel);
            this.total_virgin += Number(element.virgin);
            this.total_paquetes_virgin += Number(element.paquetes_virgin);
            this.total_etb += Number(element.etb);
            this.total_paquete_etb += Number(element.paquete_etb);
            this.total_exito += Number(element.exito);
            this.total_paquetes_exito += Number(element.paquetes_exito);
            this.total_paquetes_conectame += Number(element.paquetes_conectame);
            this.total_flashMobile += Number(element.flashMobile);
            this.total_direcTv += Number(element.direcTv);
            this.total_wom += Number(element.wom);
            this.total_paquetes_wom += Number(element.paquetes_wom);
            this.total_kalley_mobile += Number(element.kalley_mobile);
            this.total_paquetes_kalley_mobile += Number(element.paquetes_kalley_mobile);
            this.total_wings_mobile += Number(element.wings_mobile);
            this.total_paquetes_wings_mobile += Number(element.paquetes_wings_mobile);
            this.total_unicorn += Number(element.unicorn);
            this.total_wplay += Number(element.wplay);
            this.total_mega_apuesta += Number(element.mega_apuesta);
            this.total_ya_juego += Number(element.ya_juego);
            this.total_aqui_juego += Number(element.aqui_juego);
            this.total_rushBet += Number(element.rushBet);
            this.total_rivalo += Number(element.rivalo);
            this.total_miJugada += Number(element.miJugada);
            this.total_facturas_otros += Number(element.facturas_otros);
            this.total_facturas_de_gas_energia += Number(element.facturas_de_gas_energia);
            this.total_sms += Number(element.sms);
            this.total_baloto += Number(element.baloto);
            this.total_baloto_pago_de_premios += Number(element.baloto_pago_de_premios);
            this.total_certificado_de_tradicion += Number(element.certificado_de_tradicion);
            this.total_runt += Number(element.runt);
            this.total_energia_prepago_essa += Number(element.energia_prepago_essa);
            this.total_energia_Prepago_epm += Number(element.energia_Prepago_epm);
            this.total_soat_moto_estado += Number(element.soat_moto_estado);
            this.total_soat_carro_estado += Number(element.soat_carro_estado);
            this.total_soat_bus_estado += Number(element.soat_bus_estado);
            this.total_axa_soat_moto += Number(element.axa_soat_moto);
            this.total_axa_soat_carro += Number(element.axa_soat_carro);
            this.total_axa_soat_publico += Number(element.axa_soat_publico);
            this.total_movii_recargas += Number(element.movii_recargas);
            this.total_movii_retiros += Number(element.movii_retiros);
            this.total_daviplata_recargas += Number(element.daviplata_recargas);
            this.total_daviplata_retiros += Number(element.daviplata_retiros);
            this.total_taxia_recargas += Number(element.taxia_recargas);
            this.total_tpaga_retiros += Number(element.tpaga_retiros);
            this.total_razer_gold += Number(element.razer_gold);
            this.total_netflix += Number(element.netflix);
            this.total_spotify += Number(element.spotify);
            this.total_payValida += Number(element.payValida);
            this.total_freeFire += Number(element.freeFire);
            this.total_noggin += Number(element.noggin);
            this.total_crunchyroll += Number(element.crunchyroll);
            this.total_office += Number(element.office);
            this.total_win_sport += Number(element.win_sport);
            this.total_dataCredito += Number(element.dataCredito);
            this.total_paramount += Number(element.paramount);
            this.total_xbox_suscripciones += Number(element.xbox_suscripciones);
            this.total_play_station += Number(element.play_station);
            this.total_play_station_suscripciones += Number(element.play_station_suscripciones);
            this.total_minecraft += Number(element.minecraft);
            this.total_rixty += Number(element.rixty);
            this.total_payCash += Number(element.payCash);
            this.total_total += Number(element.total);

            if (!listaFechas.includes(element.fecha_cargue.toString().split(" ")[0])) {
                listaFechas.push(element.fecha_cargue.toString().split(" ")[0]);
            }
        });
        this.promedio_davivienda_pago_tarjeta_de_credito = this.total_davivienda_pago_tarjeta_de_credito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_davivienda_pago_de_credito = this.total_davivienda_pago_de_credito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_davivienda_deposito_davivienda = this.total_davivienda_deposito_davivienda / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_davivienda_retiro_davivienda = this.total_davivienda_retiro_davivienda / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_aval_tarjeta_de_credito_ban_bogota = this.total_aval_tarjeta_de_credito_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = this.total_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_aval_credito_hipotecario_ban_bogota = this.total_aval_credito_hipotecario_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_aval_otros_creditos_ban_bogota = this.total_aval_otros_creditos_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_aval_credito_motos_vehiculos_ban_bogota = this.total_aval_credito_motos_vehiculos_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_xbox_plata = this.total_xbox_plata / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_imvu = this.total_imvu / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_keo = this.total_keo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_sisteCredito = this.total_sisteCredito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_claro = this.total_claro / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_claro = this.total_paquetes_claro / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_sura = this.total_sura / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_movistar = this.total_movistar / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_movistar = this.total_paquetes_movistar / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_tigo = this.total_tigo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_tigo = this.total_paquetes_tigo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_avantel = this.total_avantel / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_avantel = this.total_paquetes_avantel / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_virgin = this.total_virgin / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_virgin = this.total_paquetes_virgin / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_etb = this.total_etb / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquete_etb = this.total_paquete_etb / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_exito = this.total_exito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_exito = this.total_paquetes_exito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_conectame = this.total_paquetes_conectame / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_flashMobile = this.total_flashMobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_direcTv = this.total_direcTv / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_wom = this.total_wom / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_wom = this.total_paquetes_wom / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_kalley_mobile = this.total_kalley_mobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_kalley_mobile = this.total_paquetes_kalley_mobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_wings_mobile = this.total_wings_mobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paquetes_wings_mobile = this.total_paquetes_wings_mobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_unicorn = this.total_unicorn / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_wplay = this.total_wplay / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_mega_apuesta = this.total_mega_apuesta / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_ya_juego = this.total_ya_juego / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_aqui_juego = this.total_aqui_juego / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_rushBet = this.total_rushBet / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_rivalo = this.total_rivalo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_miJugada = this.total_miJugada / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_facturas_otros = this.total_facturas_otros / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_facturas_de_gas_energia = this.total_facturas_de_gas_energia / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_sms = this.total_sms / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_baloto = this.total_baloto / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_baloto_pago_de_premios = this.total_baloto_pago_de_premios / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_certificado_de_tradicion = this.total_certificado_de_tradicion / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_runt = this.total_runt / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_energia_prepago_essa = this.total_energia_prepago_essa / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_energia_Prepago_epm = this.total_energia_Prepago_epm / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_soat_moto_estado = this.total_soat_moto_estado / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_soat_carro_estado = this.total_soat_carro_estado / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_soat_bus_estado = this.total_soat_bus_estado / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_axa_soat_moto = this.total_axa_soat_moto / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_axa_soat_carro = this.total_axa_soat_carro / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_axa_soat_publico = this.total_axa_soat_publico / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_movii_recargas = this.total_movii_recargas / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_movii_retiros = this.total_movii_retiros / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_daviplata_recargas = this.total_daviplata_recargas / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_daviplata_retiros = this.total_daviplata_retiros / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_taxia_recargas = this.total_taxia_recargas / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_tpaga_retiros = this.total_tpaga_retiros / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_razer_gold = this.total_razer_gold / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_netflix = this.total_netflix / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_spotify = this.total_spotify / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_payValida = this.total_payValida / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_freeFire = this.total_freeFire / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_noggin = this.total_noggin / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_crunchyroll = this.total_crunchyroll / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_office = this.total_office / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_win_sport = this.total_win_sport / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_dataCredito = this.total_dataCredito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_paramount = this.total_paramount / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_xbox_suscripciones = this.total_xbox_suscripciones / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_play_station = this.total_play_station / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_play_station_suscripciones = this.total_play_station_suscripciones / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_minecraft = this.total_minecraft / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_rixty = this.total_rixty / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_payCash = this.total_payCash / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total = this.total_total / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    //Filtro saldos
    filtroSaldos(event) {

        this.total_saldo_davivienda_pago_tarjeta_de_credito = 0;
        this.total_saldo_davivienda_pago_de_credito = 0;
        this.total_saldo_davivienda_deposito_davivienda = 0;
        this.total_saldo_davivienda_retiro_davivienda = 0;
        this.total_saldo_aval_tarjeta_de_credito_ban_bogota = 0;
        this.total_saldo_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = 0;
        this.total_saldo_aval_credito_hipotecario_ban_bogota = 0;
        this.total_saldo_aval_otros_creditos_ban_bogota = 0;
        this.total_saldo_aval_credito_motos_vehiculos_ban_bogota = 0;
        this.total_saldo_xbox_plata = 0;
        this.total_saldo_imvu = 0;
        this.total_saldo_keo = 0;
        this.total_saldo_sisteCredito = 0;
        this.total_saldo_claro = 0;
        this.total_saldo_paquetes_claro = 0;
        this.total_saldo_sura = 0;
        this.total_saldo_movistar = 0;
        this.total_saldo_paquetes_movistar = 0;
        this.total_saldo_tigo = 0;
        this.total_saldo_paquetes_tigo = 0;
        this.total_saldo_avantel = 0;
        this.total_saldo_paquetes_avantel = 0;
        this.total_saldo_virgin = 0;
        this.total_saldo_paquetes_virgin = 0;
        this.total_saldo_etb = 0;
        this.total_saldo_paquete_etb = 0;
        this.total_saldo_exito = 0;
        this.total_saldo_paquetes_exito = 0;
        this.total_saldo_paquetes_conectame = 0;
        this.total_saldo_flashMobile = 0;
        this.total_saldo_direcTv = 0;
        this.total_saldo_wom = 0;
        this.total_saldo_paquetes_wom = 0;
        this.total_saldo_kalley_mobile = 0;
        this.total_saldo_paquetes_kalley_mobile = 0;
        this.total_saldo_wings_mobile = 0;
        this.total_saldo_paquetes_wings_mobile = 0;
        this.total_saldo_unicorn = 0;
        this.total_saldo_wplay = 0;
        this.total_saldo_mega_apuesta = 0;
        this.total_saldo_ya_juego = 0;
        this.total_saldo_aqui_juego = 0;
        this.total_saldo_rushBet = 0;
        this.total_saldo_rivalo = 0;
        this.total_saldo_miJugada = 0;
        this.total_saldo_facturas_otros = 0;
        this.total_saldo_facturas_de_gas_energia = 0;
        this.total_saldo_sms = 0;
        this.total_saldo_baloto = 0;
        this.total_saldo_baloto_pago_de_premios = 0;
        this.total_saldo_certificado_de_tradicion = 0;
        this.total_saldo_runt = 0;
        this.total_saldo_energia_prepago_essa = 0;
        this.total_saldo_energia_Prepago_epm = 0;
        this.total_saldo_soat_moto_estado = 0;
        this.total_saldo_soat_carro_estado = 0;
        this.total_saldo_soat_bus_estado = 0;
        this.total_saldo_axa_soat_moto = 0;
        this.total_saldo_axa_soat_carro = 0;
        this.total_saldo_axa_soat_publico = 0;
        this.total_saldo_movii_recargas = 0;
        this.total_saldo_movii_retiros = 0;
        this.total_saldo_daviplata_recargas = 0;
        this.total_saldo_daviplata_retiros = 0;
        this.total_saldo_taxia_recargas = 0;
        this.total_saldo_tpaga_retiros = 0;
        this.total_saldo_razer_gold = 0;
        this.total_saldo_netflix = 0;
        this.total_saldo_spotify = 0;
        this.total_saldo_payValida = 0;
        this.total_saldo_freeFire = 0;
        this.total_saldo_noggin = 0;
        this.total_saldo_crunchyroll = 0;
        this.total_saldo_office = 0;
        this.total_saldo_win_sport = 0;
        this.total_saldo_dataCredito = 0;
        this.total_saldo_paramount = 0;
        this.total_saldo_xbox_suscripciones = 0;
        this.total_saldo_play_station = 0;
        this.total_saldo_play_station_suscripciones = 0;
        this.total_saldo_minecraft = 0;
        this.total_saldo_rixty = 0;
        this.total_saldo_payCash = 0;
        this.total_saldo_total = 0;



        this.promedio_saldos_davivienda_pago_tarjeta_de_credito = 0;
        this.promedio_saldos_davivienda_pago_de_credito = 0;
        this.promedio_saldos_davivienda_deposito_davivienda = 0;
        this.promedio_saldos_davivienda_retiro_davivienda = 0;
        this.promedio_saldos_aval_tarjeta_de_credito_ban_bogota = 0;
        this.promedio_saldos_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = 0;
        this.promedio_saldos_aval_credito_hipotecario_ban_bogota = 0;
        this.promedio_saldos_aval_otros_creditos_ban_bogota = 0;
        this.promedio_saldos_aval_credito_motos_vehiculos_ban_bogota = 0;
        this.promedio_saldos_xbox_plata = 0;
        this.promedio_saldos_imvu = 0;
        this.promedio_saldos_keo = 0;
        this.promedio_saldos_sisteCredito = 0;
        this.promedio_saldos_claro = 0;
        this.promedio_saldos_paquetes_claro = 0;
        this.promedio_saldos_sura = 0;
        this.promedio_saldos_movistar = 0;
        this.promedio_saldos_paquetes_movistar = 0;
        this.promedio_saldos_tigo = 0;
        this.promedio_saldos_paquetes_tigo = 0;
        this.promedio_saldos_avantel = 0;
        this.promedio_saldos_paquetes_avantel = 0;
        this.promedio_saldos_virgin = 0;
        this.promedio_saldos_paquetes_virgin = 0;
        this.promedio_saldos_etb = 0;
        this.promedio_saldos_paquete_etb = 0;
        this.promedio_saldos_exito = 0;
        this.promedio_saldos_paquetes_exito = 0;
        this.promedio_saldos_paquetes_conectame = 0;
        this.promedio_saldos_flashMobile = 0;
        this.promedio_saldos_direcTv = 0;
        this.promedio_saldos_wom = 0;
        this.promedio_saldos_paquetes_wom = 0;
        this.promedio_saldos_kalley_mobile = 0;
        this.promedio_saldos_paquetes_kalley_mobile = 0;
        this.promedio_saldos_wings_mobile = 0;
        this.promedio_saldos_paquetes_wings_mobile = 0;
        this.promedio_saldos_unicorn = 0;
        this.promedio_saldos_wplay = 0;
        this.promedio_saldos_mega_apuesta = 0;
        this.promedio_saldos_ya_juego = 0;
        this.promedio_saldos_aqui_juego = 0;
        this.promedio_saldos_rushBet = 0;
        this.promedio_saldos_rivalo = 0;
        this.promedio_saldos_miJugada = 0;
        this.promedio_saldos_facturas_otros = 0;
        this.promedio_saldos_facturas_de_gas_energia = 0;
        this.promedio_saldos_sms = 0;
        this.promedio_saldos_baloto = 0;
        this.promedio_saldos_baloto_pago_de_premios = 0;
        this.promedio_saldos_certificado_de_tradicion = 0;
        this.promedio_saldos_runt = 0;
        this.promedio_saldos_energia_prepago_essa = 0;
        this.promedio_saldos_energia_Prepago_epm = 0;
        this.promedio_saldos_soat_moto_estado = 0;
        this.promedio_saldos_soat_carro_estado = 0;
        this.promedio_saldos_soat_bus_estado = 0;
        this.promedio_saldos_axa_soat_moto = 0;
        this.promedio_saldos_axa_soat_carro = 0;
        this.promedio_saldos_axa_soat_publico = 0;
        this.promedio_saldos_movii_recargas = 0;
        this.promedio_saldos_movii_retiros = 0;
        this.promedio_saldos_daviplata_recargas = 0;
        this.promedio_saldos_daviplata_retiros = 0;
        this.promedio_saldos_taxia_recargas = 0;
        this.promedio_saldos_tpaga_retiros = 0;
        this.promedio_saldos_razer_gold = 0;
        this.promedio_saldos_netflix = 0;
        this.promedio_saldos_spotify = 0;
        this.promedio_saldos_payValida = 0;
        this.promedio_saldos_freeFire = 0;
        this.promedio_saldos_noggin = 0;
        this.promedio_saldos_crunchyroll = 0;
        this.promedio_saldos_office = 0;
        this.promedio_saldos_win_sport = 0;
        this.promedio_saldos_dataCredito = 0;
        this.promedio_saldos_paramount = 0;
        this.promedio_saldos_xbox_suscripciones = 0;
        this.promedio_saldos_play_station = 0;
        this.promedio_saldos_play_station_suscripciones = 0;
        this.promedio_saldos_minecraft = 0;
        this.promedio_saldos_rixty = 0;
        this.promedio_saldos_payCash = 0;
        this.promedio_saldos_total = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.total_saldo_davivienda_pago_tarjeta_de_credito += Number(element.davivienda_pago_tarjeta_de_credito);
            this.total_saldo_davivienda_pago_de_credito += Number(element.davivienda_pago_de_credito);
            this.total_saldo_davivienda_deposito_davivienda += Number(element.davivienda_deposito_davivienda);
            this.total_saldo_davivienda_retiro_davivienda += Number(element.davivienda_retiro_davivienda);
            this.total_saldo_aval_tarjeta_de_credito_ban_bogota += Number(element.aval_tarjeta_de_credito_ban_bogota);
            this.total_saldo_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota += Number(element.aval_cred_rotativo_crediservices_dinero_extra_ban_bogota);
            this.total_saldo_aval_credito_hipotecario_ban_bogota += Number(element.aval_credito_hipotecario_ban_bogota);
            this.total_saldo_aval_otros_creditos_ban_bogota += Number(element.aval_otros_creditos_ban_bogota);
            this.total_saldo_aval_credito_motos_vehiculos_ban_bogota += Number(element.aval_credito_motos_vehiculos_ban_bogota);
            this.total_saldo_xbox_plata += Number(element.xbox_plata);
            this.total_saldo_imvu += Number(element.imvu);
            this.total_saldo_keo += Number(element.keo);
            this.total_saldo_sisteCredito += Number(element.sisteCredito);
            this.total_saldo_claro += Number(element.claro);
            this.total_saldo_paquetes_claro += Number(element.paquetes_claro);
            this.total_saldo_sura += Number(element.sura);
            this.total_saldo_movistar += Number(element.movistar);
            this.total_saldo_paquetes_movistar += Number(element.paquetes_movistar);
            this.total_saldo_tigo += Number(element.tigo);
            this.total_saldo_paquetes_tigo += Number(element.paquetes_tigo);
            this.total_saldo_avantel += Number(element.avantel);
            this.total_saldo_paquetes_avantel += Number(element.paquetes_avantel);
            this.total_saldo_virgin += Number(element.virgin);
            this.total_saldo_paquetes_virgin += Number(element.paquetes_virgin);
            this.total_saldo_etb += Number(element.etb);
            this.total_saldo_paquete_etb += Number(element.paquete_etb);
            this.total_saldo_exito += Number(element.exito);
            this.total_saldo_paquetes_exito += Number(element.paquetes_exito);
            this.total_saldo_paquetes_conectame += Number(element.paquetes_conectame);
            this.total_saldo_flashMobile += Number(element.flashMobile);
            this.total_saldo_direcTv += Number(element.direcTv);
            this.total_saldo_wom += Number(element.wom);
            this.total_saldo_paquetes_wom += Number(element.paquetes_wom);
            this.total_saldo_kalley_mobile += Number(element.kalley_mobile);
            this.total_saldo_paquetes_kalley_mobile += Number(element.paquetes_kalley_mobile);
            this.total_saldo_wings_mobile += Number(element.wings_mobile);
            this.total_saldo_paquetes_wings_mobile += Number(element.paquetes_wings_mobile);
            this.total_saldo_unicorn += Number(element.unicorn);
            this.total_saldo_wplay += Number(element.wplay);
            this.total_saldo_mega_apuesta += Number(element.mega_apuesta);
            this.total_saldo_ya_juego += Number(element.ya_juego);
            this.total_saldo_aqui_juego += Number(element.aqui_juego);
            this.total_saldo_rushBet += Number(element.rushBet);
            this.total_saldo_rivalo += Number(element.rivalo);
            this.total_saldo_miJugada += Number(element.miJugada);
            this.total_saldo_facturas_otros += Number(element.facturas_otros);
            this.total_saldo_facturas_de_gas_energia += Number(element.facturas_de_gas_energia);
            this.total_saldo_sms += Number(element.sms);
            this.total_saldo_baloto += Number(element.baloto);
            this.total_saldo_baloto_pago_de_premios += Number(element.baloto_pago_de_premios);
            this.total_saldo_certificado_de_tradicion += Number(element.certificado_de_tradicion);
            this.total_saldo_runt += Number(element.runt);
            this.total_saldo_energia_prepago_essa += Number(element.energia_prepago_essa);
            this.total_saldo_energia_Prepago_epm += Number(element.energia_Prepago_epm);
            this.total_saldo_soat_moto_estado += Number(element.soat_moto_estado);
            this.total_saldo_soat_carro_estado += Number(element.soat_carro_estado);
            this.total_saldo_soat_bus_estado += Number(element.soat_bus_estado);
            this.total_saldo_axa_soat_moto += Number(element.axa_soat_moto);
            this.total_saldo_axa_soat_carro += Number(element.axa_soat_carro);
            this.total_saldo_axa_soat_publico += Number(element.axa_soat_publico);
            this.total_saldo_movii_recargas += Number(element.movii_recargas);
            this.total_saldo_movii_retiros += Number(element.movii_retiros);
            this.total_saldo_daviplata_recargas += Number(element.daviplata_recargas);
            this.total_saldo_daviplata_retiros += Number(element.daviplata_retiros);
            this.total_saldo_taxia_recargas += Number(element.taxia_recargas);
            this.total_saldo_tpaga_retiros += Number(element.tpaga_retiros);
            this.total_saldo_razer_gold += Number(element.razer_gold);
            this.total_saldo_netflix += Number(element.netflix);
            this.total_saldo_spotify += Number(element.spotify);
            this.total_saldo_payValida += Number(element.payValida);
            this.total_saldo_freeFire += Number(element.freeFire);
            this.total_saldo_noggin += Number(element.noggin);
            this.total_saldo_crunchyroll += Number(element.crunchyroll);
            this.total_saldo_office += Number(element.office);
            this.total_saldo_win_sport += Number(element.win_sport);
            this.total_saldo_dataCredito += Number(element.dataCredito);
            this.total_saldo_paramount += Number(element.paramount);
            this.total_saldo_xbox_suscripciones += Number(element.xbox_suscripciones);
            this.total_saldo_play_station += Number(element.play_station);
            this.total_saldo_play_station_suscripciones += Number(element.play_station_suscripciones);
            this.total_saldo_minecraft += Number(element.minecraft);
            this.total_saldo_rixty += Number(element.rixty);
            this.total_saldo_payCash += Number(element.payCash);
            this.total_saldo_total += Number(element.total);

            if (!listaFechas.includes(element.fecha_cargue.toString().split(" ")[0])) {
                listaFechas.push(element.fecha_cargue.toString().split(" ")[0]);
            }
        });
        this.promedio_saldos_davivienda_pago_tarjeta_de_credito = this.total_saldo_davivienda_pago_tarjeta_de_credito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_davivienda_pago_de_credito = this.total_saldo_davivienda_pago_de_credito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_davivienda_deposito_davivienda = this.total_saldo_davivienda_deposito_davivienda / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_davivienda_retiro_davivienda = this.total_saldo_davivienda_retiro_davivienda / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_aval_tarjeta_de_credito_ban_bogota = this.total_saldo_aval_tarjeta_de_credito_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota = this.total_saldo_aval_cred_rotativo_crediservices_dinero_extra_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_aval_credito_hipotecario_ban_bogota = this.total_saldo_aval_credito_hipotecario_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_aval_otros_creditos_ban_bogota = this.total_saldo_aval_otros_creditos_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_aval_credito_motos_vehiculos_ban_bogota = this.total_saldo_aval_credito_motos_vehiculos_ban_bogota / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_xbox_plata = this.total_saldo_xbox_plata / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_imvu = this.total_saldo_imvu / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_keo = this.total_saldo_keo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_sisteCredito = this.total_saldo_sisteCredito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_claro = this.total_saldo_claro / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_claro = this.total_saldo_paquetes_claro / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_sura = this.total_saldo_sura / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_movistar = this.total_saldo_movistar / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_movistar = this.total_saldo_paquetes_movistar / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_tigo = this.total_saldo_tigo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_tigo = this.total_saldo_paquetes_tigo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_avantel = this.total_saldo_avantel / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_avantel = this.total_saldo_paquetes_avantel / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_virgin = this.total_saldo_virgin / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_virgin = this.total_saldo_paquetes_virgin / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_etb = this.total_saldo_etb / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquete_etb = this.total_saldo_paquete_etb / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_exito = this.total_saldo_exito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_exito = this.total_saldo_paquetes_exito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_conectame = this.total_saldo_paquetes_conectame / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_flashMobile = this.total_saldo_flashMobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_direcTv = this.total_saldo_direcTv / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_wom = this.total_saldo_wom / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_wom = this.total_saldo_paquetes_wom / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_kalley_mobile = this.total_saldo_kalley_mobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_kalley_mobile = this.total_saldo_paquetes_kalley_mobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_wings_mobile = this.total_saldo_wings_mobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paquetes_wings_mobile = this.total_saldo_paquetes_wings_mobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_unicorn = this.total_saldo_unicorn / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_wplay = this.total_saldo_wplay / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_mega_apuesta = this.total_saldo_mega_apuesta / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_ya_juego = this.total_saldo_ya_juego / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_aqui_juego = this.total_saldo_aqui_juego / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_rushBet = this.total_saldo_rushBet / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_rivalo = this.total_saldo_rivalo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_miJugada = this.total_saldo_miJugada / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_facturas_otros = this.total_saldo_facturas_otros / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_facturas_de_gas_energia = this.total_saldo_facturas_de_gas_energia / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_sms = this.total_saldo_sms / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_baloto = this.total_saldo_baloto / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_baloto_pago_de_premios = this.total_saldo_baloto_pago_de_premios / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_certificado_de_tradicion = this.total_saldo_certificado_de_tradicion / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_runt = this.total_saldo_runt / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_energia_prepago_essa = this.total_saldo_energia_prepago_essa / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_energia_Prepago_epm = this.total_saldo_energia_Prepago_epm / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_soat_moto_estado = this.total_saldo_soat_moto_estado / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_soat_carro_estado = this.total_saldo_soat_carro_estado / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_soat_bus_estado = this.total_saldo_soat_bus_estado / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_axa_soat_moto = this.total_saldo_axa_soat_moto / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_axa_soat_carro = this.total_saldo_axa_soat_carro / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_axa_soat_publico = this.total_saldo_axa_soat_publico / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_movii_recargas = this.total_saldo_movii_recargas / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_movii_retiros = this.total_saldo_movii_retiros / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_daviplata_recargas = this.total_saldo_daviplata_recargas / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_daviplata_retiros = this.total_saldo_daviplata_retiros / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_taxia_recargas = this.total_saldo_taxia_recargas / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_tpaga_retiros = this.total_saldo_tpaga_retiros / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_razer_gold = this.total_saldo_razer_gold / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_netflix = this.total_saldo_netflix / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_spotify = this.total_saldo_spotify / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_payValida = this.total_saldo_payValida / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_freeFire = this.total_saldo_freeFire / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_noggin = this.total_saldo_noggin / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_crunchyroll = this.total_saldo_crunchyroll / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_office = this.total_saldo_office / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_win_sport = this.total_saldo_win_sport / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_dataCredito = this.total_saldo_dataCredito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_paramount = this.total_saldo_paramount / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_xbox_suscripciones = this.total_saldo_xbox_suscripciones / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_play_station = this.total_saldo_play_station / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_play_station_suscripciones = this.total_saldo_play_station_suscripciones / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_minecraft = this.total_saldo_minecraft / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_rixty = this.total_saldo_rixty / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_payCash = this.total_saldo_payCash / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_saldos_total = this.total_saldo_total / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    //Filtro recargas
    filtroRecargas(event) {

        this.total_recargas_ayudas_a_familias = 0;
        this.total_recargas_claro = 0;
        this.total_recargas_paquetes_claro = 0;
        this.total_recargas_paquetes_movistar = 0;
        this.total_recargas_movistar = 0;
        this.total_recargas_paquetes_tigo = 0;
        this.total_recargas_tigo = 0;
        this.total_recargas_avantel = 0;
        this.total_recargas_paquetes_avantel = 0;
        this.total_recargas_virgin = 0;
        this.total_recargas_paquetes_virgin = 0;
        this.total_recargas_paquete_etb = 0;
        this.total_recargas_etb = 0;
        this.total_recargas_exito = 0;
        this.total_recargas_paquetes_exito = 0;
        this.total_recargas_paquetes_conectame = 0;
        this.total_recargas_conectame = 0;
        this.total_recargas_sipmobile = 0;
        this.total_recargas_flashmobile = 0;
        this.total_recargas_directv = 0;
        this.total_recargas_iyo_movil = 0;
        this.total_recargas_comunicamos = 0;
        this.total_recargas_wom = 0;
        this.total_recargas_paquetes_wom = 0;
        this.total_recargas_kalley_mobile = 0;
        this.total_recargas_paquetes_kalley = 0;
        this.total_recargas_total = 0;


        this.promedio_total_recargas_ayudas_a_familias = 0;
        this.promedio_total_recargas_claro = 0;
        this.promedio_total_recargas_paquetes_claro = 0;
        this.promedio_total_recargas_paquetes_movistar = 0;
        this.promedio_total_recargas_movistar = 0;
        this.promedio_total_recargas_paquetes_tigo = 0;
        this.promedio_total_recargas_tigo = 0;
        this.promedio_total_recargas_avantel = 0;
        this.promedio_total_recargas_paquetes_avantel = 0;
        this.promedio_total_recargas_virgin = 0;
        this.promedio_total_recargas_paquetes_virgin = 0;
        this.promedio_total_recargas_paquete_etb = 0;
        this.promedio_total_recargas_etb = 0;
        this.promedio_total_recargas_exito = 0;
        this.promedio_total_recargas_paquetes_exito = 0;
        this.promedio_total_recargas_paquetes_conectame = 0;
        this.promedio_total_recargas_conectame = 0;
        this.promedio_total_recargas_sipmobile = 0;
        this.promedio_total_recargas_flashmobile = 0;
        this.promedio_total_recargas_directv = 0;
        this.promedio_total_recargas_iyo_movil = 0;
        this.promedio_total_recargas_comunicamos = 0;
        this.promedio_total_recargas_wom = 0;
        this.promedio_total_recargas_paquetes_wom = 0;
        this.promedio_total_recargas_kalley_mobile = 0;
        this.promedio_total_recargas_paquetes_kalley = 0;
        this.promedio_total_recargas_total = 0;
        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {
            this.total_recargas_ayudas_a_familias += Number(element.ayudas_a_familias);
            this.total_recargas_claro += Number(element.claro);
            this.total_recargas_paquetes_claro += Number(element.paquetes_claro);
            this.total_recargas_paquetes_movistar += Number(element.paquetes_movistar);
            this.total_recargas_movistar += Number(element.movistar);
            this.total_recargas_paquetes_tigo += Number(element.paquetes_tigo);
            this.total_recargas_tigo += Number(element.tigo);
            this.total_recargas_avantel += Number(element.avantel);
            this.total_recargas_paquetes_avantel += Number(element.paquetes_avantel);
            this.total_recargas_virgin += Number(element.virgin);
            this.total_recargas_paquetes_virgin += Number(element.paquetes_virgin);
            this.total_recargas_paquete_etb += Number(element.paquete_etb);
            this.total_recargas_etb += Number(element.etb);
            this.total_recargas_exito += Number(element.exito);
            this.total_recargas_paquetes_exito += Number(element.paquetes_exito);
            this.total_recargas_paquetes_conectame += Number(element.paquetes_conectame);
            this.total_recargas_conectame += Number(element.conectame);
            this.total_recargas_sipmobile += Number(element.sipmobile);
            this.total_recargas_flashmobile += Number(element.flashmobile);
            this.total_recargas_directv += Number(element.directv);
            this.total_recargas_iyo_movil += Number(element.iyo_movil);
            this.total_recargas_comunicamos += Number(element.comunicamos);
            this.total_recargas_wom += Number(element.wom);
            this.total_recargas_paquetes_wom += Number(element.paquetes_wom);
            this.total_recargas_kalley_mobile += Number(element.kalley_mobile);
            this.total_recargas_paquetes_kalley += Number(element.paquetes_kalley);
            this.total_recargas_total += Number(element.total);

            if (!listaFechas.includes(element.fecha_cargue.toString().split(" ")[0])) {
                listaFechas.push(element.fecha_cargue.toString().split(" ")[0]);
            }
        });
        this.promedio_total_recargas_ayudas_a_familias = this.total_recargas_ayudas_a_familias / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_claro = this.total_recargas_claro / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquetes_claro = this.total_recargas_paquetes_claro / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquetes_movistar = this.total_recargas_paquetes_movistar / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_movistar = this.total_recargas_movistar / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquetes_tigo = this.total_recargas_paquetes_tigo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_tigo = this.total_recargas_tigo / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_avantel = this.total_recargas_avantel / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquetes_avantel = this.total_recargas_paquetes_avantel / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_virgin = this.total_recargas_virgin / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquetes_virgin = this.total_recargas_paquetes_virgin / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquete_etb = this.total_recargas_paquete_etb / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_etb = this.total_recargas_etb / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_exito = this.total_recargas_exito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquetes_exito = this.total_recargas_paquetes_exito / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquetes_conectame = this.total_recargas_paquetes_conectame / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_conectame = this.total_recargas_conectame / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_sipmobile = this.total_recargas_sipmobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_flashmobile = this.total_recargas_flashmobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_directv = this.total_recargas_directv / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_iyo_movil = this.total_recargas_iyo_movil / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_comunicamos = this.total_recargas_comunicamos / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_wom = this.total_recargas_wom / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquetes_wom = this.total_recargas_paquetes_wom / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_kalley_mobile = this.total_recargas_kalley_mobile / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_paquetes_kalley = this.total_recargas_paquetes_kalley / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedio_total_recargas_total = this.total_recargas_total / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }

    //Filtro Ganancias
    filtroIndicadores(event) {

        this.totalGanancias = 0;
        this.totalSaldos = 0;
        this.totalRecargas = 0;

        this.promedioGanancias = 0;
        this.promedioSaldos = 0;
        this.promedioRecargas = 0;

        let dataFiltrada = event.filteredValue;
        let listaFechas = [];
        dataFiltrada.forEach(element => {

            this.totalGanancias += Number(element.ganancias);
            this.totalSaldos += Number(element.saldos);
            this.totalRecargas += Number(element.recargas);

            if (!listaFechas.includes(element.fecha_cargue.toString().split(" ")[0])) {
                listaFechas.push(element.fecha_cargue.toString().split(" ")[0]);
            }
        });

        this.promedioGanancias = this.totalGanancias / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedioSaldos = this.totalSaldos / (listaFechas.length == 0 ? 1 : listaFechas.length);
        this.promedioRecargas = this.totalRecargas / (listaFechas.length == 0 ? 1 : listaFechas.length);
    }


    clear(table: Table) {
        table.clear();
        switch (table) {
            case this.tableIndicadores:
                this.getIndicadores();
                this.rangoFechasIndicadores = [];
                break;
            case this.tableGanancias:
                this.getGanancias();
                this.rangoFechasGanancias = [];
                break;
            case this.tableSaldos:
                this.getSaldos();
                this.rangoFechasSaldos = [];
                break;
            case this.tableRecargas:
                this.getRecargas();
                this.rangoFechasRecargas = [];
                break;
            default:
                break;
        }
    }

    formatDate(date: Date) {
        return [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth() + 1),
            this.padTo2Digits(date.getDate())
        ].join('-');
    }

    padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }


}
