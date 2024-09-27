import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TourComponent } from './components/tour/tour.component';
import { IntroComponent } from './components/intro/intro.component';

const routes: Routes = [
  { path: '', component: TourComponent },
  { path: '2', component: IntroComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
