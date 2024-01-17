import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare const webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechserviceService {

  private recognition: any;
  texto:string=""

  constructor() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = 'es-ES'; 
  }

  startListening(): void {
    this.recognition.start();
    this.recognition.onresult = (event: any) => {
      this.texto = event.results[0][0].transcript;

    };
  }

  stopListening(): void {
    this.recognition.stop();
    console.log("texto encontrado:")
    console.log(this.texto)
  }




}