import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TiendaOnlineService {

    constructor(private http: HttpClient) { }

    getDataTienda() { }
    uploadDataTienda() {

    }
}
