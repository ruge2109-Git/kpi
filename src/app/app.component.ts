import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    menuMode = 'static';

    constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
        this.primengConfig.setTranslation({
            accept: 'Aceptar',
            reject: 'Cancelar',
            startsWith: 'Comenzar con',
            contains: 'Contiene',
            notContains: 'No contiene',
            endsWith: 'Finaliza con',
            equals: 'Igual',
            notEquals: 'Diferente',
            noFilter: 'Quitar filtro',
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            dayNamesShort: ['Lun', 'Mar', 'Mi', 'Jue', 'Vie', 'Sáb', 'Dom']

            //translations
        });
    }
}
