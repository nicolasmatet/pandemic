import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card, GameService, PlayerView, PlayRoomState} from '../shared/services/game.service';
import {CardsService} from '../shared/services/cards.service';
import {transferArrayItem} from '@angular/cdk/drag-drop';
import {LocationService} from '../shared/services/location.service';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  selectedCards: Card[] = [];
  dictLocations: {};
  @Input() playroomView: PlayRoomState;
  @Input() playerViews: PlayerView[] = [];
  @Output() playerMenu = new EventEmitter<boolean>();


  constructor(private gameService: GameService,
              private locationService: LocationService,
              private cardService: CardsService) {
  }

  ngOnInit(): void {

    this.gameService.gameSetupView.subscribe(gameSetupView => {
      this.dictLocations = gameSetupView.locations;
    });

    this.cardService.selectedCards.subscribe(selectedCards => {
      this.selectedCards = selectedCards;
      if (this.selectedCards && this.selectedCards.length === 1) {
        const card = selectedCards[0];
        if (this.isLocation(card)) {
          const location = this.dictLocations[card.name];
          this.locationService.selectLocation(location);
        }
      } else if (this.selectedCards && this.selectedCards.length === 0) {
        this.locationService.unselectLocation();
      }
    });
  }

  isLocation(card) {
    return this.dictLocations && this.dictLocations[card.name];
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
    const fromPlayer = event.previousContainer.id;
    const toPlayer = event.container.id;
    const card = event.previousContainer.data[event.previousIndex];
    const canGive = this.gameService.canGiveCard(fromPlayer, toPlayer, card);
    if (canGive) {
      this.gameService.giveCard(fromPlayer, toPlayer, card.name);
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }


  }

}
