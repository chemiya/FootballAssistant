import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,of } from 'rxjs';


const baseUrl="http://localhost:5000/dialogflow"
@Injectable({
  providedIn: 'root'
})


export class ConexionApiService {

  constructor(private http: HttpClient) { }

  enviarConsulta(consulta:any): Observable<any> {//devuelvo array y obtiene array en la peticion

    return this.http.post(baseUrl,consulta);
  }
}
