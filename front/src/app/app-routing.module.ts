import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { SpeechComponent } from './speech/speech.component';

const routes: Routes = [
  { path: 'speech', component: SpeechComponent },
  { path: 'details', component: DetailsComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'speech' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
