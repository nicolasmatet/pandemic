import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CreatePlayroomComponent} from './create-playroom/create-playroom.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SocketService} from './create-playroom/shared/services/socket.service';
import {PlayroomComponent} from './playroom/playroom.component';
import {PlayersComponent} from './players/players.component';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {GameComponent, MapToArray} from './playroom/game/game.component';
import {MatMenuModule} from '@angular/material/menu';
import {CardsComponent} from './playroom/cards/cards.component';
import {GameService} from './playroom/shared/services/game.service';
import {ActioncounterComponent} from './playroom/phase-display/actioncounter/actioncounter.component';
import {PhaseDisplayComponent} from './playroom/phase-display/phase-display.component';
import {DumpphaseComponent, GetDumpContext} from './playroom/phase-display/dumpphase/dumpphase.component';
import {ActionbarComponent} from './playroom/actionbar/actionbar.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {EpidemicComponent} from './playroom/phase-display/epidemic/epidemic.component';
import {ChoosecardsComponent} from './playroom/choosecards/choosecards.component';
import {environment} from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    CreatePlayroomComponent,
    PlayroomComponent,
    PlayersComponent,
    GameComponent,
    CardsComponent,
    ActioncounterComponent,
    PhaseDisplayComponent,
    DumpphaseComponent,
    GetDumpContext,
    MapToArray,
    ActionbarComponent,
    EpidemicComponent,
    ChoosecardsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    DragDropModule
  ],
  providers: [SocketService, GameService, {provide: 'environment', useValue: environment},
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
  public static forRoot(env: any): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: [
        {provide: 'environment', useValue: env},
      ]
    };
  }

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon('biohazard',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/img/biohazard.svg'));

  }

}

