import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreatePlayroomComponent} from './create-playroom/create-playroom.component';
import {PlayroomComponent} from './playroom/playroom.component';


const routes: Routes = [
  {
    path: '',
    component: CreatePlayroomComponent,
    canActivate: []
  },
  {
    path: 'pandemic/:playroom',
    component: PlayroomComponent,
    canActivate: []
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

