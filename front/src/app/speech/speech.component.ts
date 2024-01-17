import { Component } from '@angular/core';
import { SpeechserviceService } from '../speechservice.service';
import { ConexionApiService } from '../conexion-api.service';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.css']
})
export class SpeechComponent {

  entrada: string = '';
  respuesta: string = '';
  resultados: any = []
  clasificacion: any = []
  mostrarTabla: boolean = false
  mostrarRespuesta: boolean = false
  mostrarClasificacion: boolean = false
  mostrarError: boolean = false
  respuestaError:string=""
  entrada_texto: boolean = true
  historial: any = []
  mostrarRespuestasHistorial: boolean = true
  mostrarCargador: boolean = false
  entrada_audio:boolean=false
  constructor(public speech: SpeechserviceService, public conexionApi: ConexionApiService) {
    
  }

  ngOnInit(): void {
  }

  startService(): void {
    this.entrada_texto = false
    this.entrada_audio=true;
    this.speech.texto = '';
    this.speech.startListening();
    
    

  }

  stopService(): void {
    this.entrada_audio=false;
    console.log("finalizando")
    this.entrada = this.speech.texto
    console.log("entrada:")
    console.log(this.entrada)
    this.speech.stopListening()
  }


  enviar() {
    this.mostrarCargador = true;
    this.mostrarRespuestasHistorial = false
    setTimeout(() => {
      this.mostrarCargador = false;
      this.mostrarRespuestasHistorial = true;
    }, 3000);



    if (this.entrada_texto == false) {
      this.entrada = this.speech.texto
      this.speech.stopListening()
    }

    console.log("entrada enviada" + this.entrada)
    const mensaje = {
      queryText: this.entrada,
      sessionId: 'abcd1234',
      languageCode: 'es'
    };
    this.conexionApi.enviarConsulta(mensaje)
      .subscribe({
        next: (data) => {
          console.log(data)
          
          if(data.tipo==-1){
            this.respuesta=data.error
          }
          if (data.tipo == 1) {
            this.clasificacion = data.clasificacion

            this.mostrarClasificacion = true;
            this.mostrarTabla = false;
            this.mostrarRespuesta = false;
          }
          else if (data.tipo == 2) {
            this.resultados = data.resultados
            this.mostrarTabla = true;
            this.mostrarRespuesta = false;
            this.mostrarClasificacion = false;
            console.log("resultados obtenidos:")
            console.log(this.resultados)
            this.resultados.forEach((elemento:any) => {
              if(elemento.resultado_local==null){
                elemento.resultado_local="Pendiente"
                elemento.resultado_visitante="Pendiente"
              }
            });


          } else if (data.tipo == 3 || data.tipo == 4) {
            this.respuesta = data.respuesta
            this.mostrarRespuesta = true;
            this.mostrarTabla = false;
            this.mostrarClasificacion = false;
          }

          else if(data.error==1){
            this.respuesta = data.mensaje
            this.mostrarRespuesta = true;
            this.mostrarTabla = false;
            this.mostrarClasificacion = false;
          }







          if (data.tipo == 3 || data.tipo == 4 ||data.error==1 ) {
            var elemento_historial = {
              pregunta: this.entrada,
              respuesta: this.respuesta,
              tipo: "respuesta"
            }


            this.historial.unshift(elemento_historial)
            console.log(this.historial)
          }



          else if (data.tipo == 1) {
            var elemento_historial_clasificacion = {
              pregunta: this.entrada,
              respuesta: this.clasificacion,
              tipo: "clasificacion"
            }

            this.historial.unshift(elemento_historial_clasificacion)
            console.log(this.historial)
          }



          else if (data.tipo == 2){
            var elemento_historial_resultados = {
              pregunta: this.entrada,
              respuesta: this.resultados,
              tipo: "resultados"
            }

            this.historial.unshift(elemento_historial_resultados)
            console.log(this.historial)

          }

          else if (data.tipo == -1){
            var elemento_historial_error = {
              pregunta: this.entrada,
              respuesta: this.respuesta,
              tipo: "error"
            }

            this.historial.unshift(elemento_historial_error)
            console.log(this.historial)
          }







          this.entrada = ""
          this.speech.texto = ""



        },
        error: (e) => console.error(e)
      });
  }
}
