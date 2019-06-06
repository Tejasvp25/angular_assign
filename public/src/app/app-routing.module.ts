import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { ChatPageComponent } from './Components/chat-page/chat-page.component';
import { RouteGuardService } from './Services/routeGuard-service/route-guard.service';

const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'chatRoom', component: ChatPageComponent, canActivate: [RouteGuardService]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
