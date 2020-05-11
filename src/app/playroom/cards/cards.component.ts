import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card, GameService, PlayerView, PlayRoomState} from '../shared/services/game.service';
import {CardsService} from '../shared/services/cards.service';
import {transferArrayItem} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  selectedCards: Card[] = [];
  @Input() playroomView: PlayRoomState;
  @Input() playerViews: PlayerView[] = [];
  @Output() playerMenu = new EventEmitter<boolean>();

  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  constructor(private gameService: GameService, private cardService: CardsService) {
  }

  ngOnInit(): void {
    this.cardService.selectedCards.subscribe(selectedCards => {
      this.selectedCards = selectedCards;
    });
  }



  selectCard(event, card) {
    if (event.ctrlKey) {
      this.cardService.toogleCardSelection(card);
    }
    else {
      this.cardService.selectCard(card);
    }
  }

  onOpenPlayerMenu() {
    this.playerMenu.emit(true);
  }

  drop(event) {
    console.log(event);
    const fromPlayer = event.previousContainer.id;
    const toPlayer = event.container.id;
    const card = event.previousContainer.data[event.previousIndex];
    const canGive = this.gameService.canGiveCard(fromPlayer, toPlayer, card);
    if (canGive) {
      console.log(fromPlayer, toPlayer, card);
      this.gameService.giveCard(fromPlayer, toPlayer, card.name);
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }


  }

}
