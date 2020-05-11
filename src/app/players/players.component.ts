import {Component, Inject, OnInit} from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {GameService, PlayRoomState} from '../playroom/shared/services/game.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


const ALL_ROLES = [
  {value: 'medecin', viewValue: 'Médecin'},
  {value: 'repartiteuse', viewValue: 'Répartiteuse'},
  {value: 'specialiste', viewValue: 'Spécialiste en confinement'},
  {value: 'expert', viewValue: 'Expert opérationnel'},
  {value: 'planificateur', viewValue: 'Planificateur d\'urgence'},
  {value: 'chercheuse', viewValue: 'Chercheuse'},
  {value: 'scientifique', viewValue: 'Scientifique'}
];

export interface PlayersComponentData {
  playroomView: PlayRoomState;
}

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  // players: Player[] = [];
  // hasStarted = false;
  // selfPlayer: Player = null;


  username = 'M.Beauchat';
  roles = ALL_ROLES;
  playroomView: PlayRoomState;

  constructor(private gameService: GameService,
              public dialogRef: MatDialogRef<PlayersComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PlayersComponentData) {
    this.playroomView = this.data.playroomView;

    this.gameService.playroomView.subscribe(playroomView => {
      this.playroomView = playroomView;
    });

  }

  ngOnInit(): void {

  }

  public setUsername(event) {
    this.username = event.target.value;
    this.joinGame();
  }

  public joinGameAs(player) {
    this.username = player.name;
    this.joinGame();
  }

  public joinGame() {
    console.log(this.username);
    this.gameService.joinGameAs(this.username);
  }

  public kickPlayer(player) {
    this.gameService.kickPlayer(player.name);
  }

  public readyPlayer(event: MatCheckboxChange) {
    this.gameService.readyPlayer(event.checked);
  }

  public chooseRole() {
    this.gameService.chooseRole(this.playroomView.player.role);

  }

  public onStartGame() {
    this.dialogRef.close();
    this.gameService.onStartGame();
  }
}
