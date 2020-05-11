import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {CardType, GameService} from '../shared/services/game.service';


export interface ChooseCardData {
  cards: string[];
  ncards: number;
}

@Component({
  selector: 'app-choosecards',
  templateUrl: './choosecards.component.html',
  styleUrls: ['./choosecards.component.scss']
})
export class ChoosecardsComponent implements OnInit {

  cards: string[] = [];
  ncards: number = 1;
  chosenCards: string[] = [];
  dictLocations = {};
  cardTypes = CardType;

  constructor(public dialogRef: MatDialogRef<ChoosecardsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ChooseCardData, private gameService: GameService) {
    this.cards = this.data.cards;
    this.ncards = this.data.ncards;
  }

  ngOnInit(): void {
    this.gameService.gameSetupView.subscribe(gameSetupView => {
      this.dictLocations = gameSetupView.locations;
    });
  }

  dropCard(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event);
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
