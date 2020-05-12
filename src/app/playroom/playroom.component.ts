import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MsgTypes, PlayroomsocketService} from './shared/services/playroomsocket.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GameService} from './shared/services/game.service';
import {MatDialog} from '@angular/material/dialog';
import {PlayersComponent} from '../players/players.component';
import {ChoosecardsComponent} from './choosecards/choosecards.component';

export interface CardListView {
  cards: string[];
  secret?: string;
}

@Component({
  selector: 'app-playroom',
  templateUrl: './playroom.component.html',
  styleUrls: ['./playroom.component.scss']
})
export class PlayroomComponent implements OnInit, AfterViewInit {
  playroom: string;
  menuSelection = 'players';
  playroomView: any;
  playerViews = [];
  gameStateView: any;

  constructor(private route: ActivatedRoute, private socket: PlayroomsocketService,
              private gameService: GameService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog) {

    this.playroom = this.route.snapshot.paramMap.get('playroom');
    this.gameService.startListening(this.playroom);
    console.log('reached playroom', this.playroom);


  }

  sendCommand(event) {
    this.socket.send(event.target.value);
  }

  ngOnInit() {
    this.socket.stream(MsgTypes.INFO).subscribe(msg => {
      console.log(msg.type, msg.message);
    });

    this.socket.stream(MsgTypes.ERROR).subscribe(msg => {
      console.log(msg.type, msg.message);
      this.openSnackBar(msg.message, 'Ok');
    });

    this.socket.stream(MsgTypes.CARD_LIST).subscribe(msg => {
      console.log(msg.type, msg.message);
      const cardList: CardListView = JSON.parse(msg.message);
      this.openChooseCard(cardList.cards, cardList.secret);
    });


    this.gameService.playerViews.subscribe(playerViews => {
      this.playerViews = playerViews;
    });

    this.gameService.gameStateView.subscribe(gameStateView => {
      this.gameStateView = gameStateView;
    });

    this.gameService.playroomView.subscribe(playroomView => {
      this.playroomView = playroomView;
    });


    this.gameService.getGameSetup();
    this.gameService.getPlayroomState();
    this.gameService.getGameState();

  }

  ngAfterViewInit() {
    this.openPlayerMenu();
  }

  setMenuSelection(value) {
    this.menuSelection = value;
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


  openChooseCard(cards, secret): void {
    let ncards = 0;
    let disableClose = false;
    if (secret) {
      disableClose = true;
      ncards = cards.length;
    }

    const dialogRef = this.dialog.open(ChoosecardsComponent, {
      width: '440px',
      disableClose,
      data: {cards, ncards}
    });
    if (ncards) {
      dialogRef.afterClosed().subscribe(chosenCards => {
        this.gameService.setNextInfections(secret, chosenCards);
        console.log('The dialog was closed');
      });
    }


  }

  openPlayerMenu(): void {
    const dialogRef = this.dialog.open(PlayersComponent, {
      width: '440px',
      data: {playroomView: this.playroomView}
    });


  }

}
