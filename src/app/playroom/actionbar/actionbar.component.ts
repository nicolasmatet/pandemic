import {Component, OnInit} from '@angular/core';
import {CardsService} from '../shared/services/cards.service';
import {CardType, EventType, GameService, GameState, MapLocation, PlayerRoles, PlayRoomState} from '../shared/services/game.service';
import {GamePhase, GameRules} from '../phase-display/phase-display.component';
import {LocationService} from '../shared/services/location.service';
import {ChoosecardsComponent} from '../choosecards/choosecards.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-actionbar',
  templateUrl: './actionbar.component.html',
  styleUrls: ['./actionbar.component.scss']
})
export class ActionbarComponent implements OnInit {
  selectedCards = [];
  gameStateView: GameState = {};
  gameRules = GameRules;
  gamePhases = GamePhase;
  selectedLocation: MapLocation;
  rolesEnum = PlayerRoles;
  playroomView: PlayRoomState;
  cardTypes = CardType;

  constructor(private cardService: CardsService, private gameService: GameService, private locationService: LocationService,
              public dialog: MatDialog) {
    this.gameService.gameStateView.subscribe(gameStateView => {
      this.gameStateView = gameStateView;
    });
    this.gameService.playroomView.subscribe(playroomView => {
      this.playroomView = playroomView;
    });
    this.cardService.selectedCards.subscribe(selectedCards => {
      this.selectedCards = selectedCards;
    });
    this.locationService.selectedLocation.subscribe(selectedLocation => {
      this.selectedLocation = selectedLocation;
    });

  }

  dumpCard() {
    this.gameService.dumpCard(this.selectedCards.map(card => card.name));
    // this.cardService.toogleCardSelection(cardToDump);
  }

  cancelLastAction() {
    this.gameService.cancelLastAction();
  }

  cureDisease() {
    this.gameService.cureDisease(this.selectedCards.map(card => card.name));
    this.cardService.unSelectCards();
  }

  buildResearchCenter() {
    if (this.selectedCards.length === 1 && this.selectedLocation && this.selectedCards[0].name === EventType.subvention) {
      this.playEventSubvention();
      this.cardService.unSelectCards();
      this.locationService.unselectLocation();
    }
    else {
      this.gameService.buildResearchCenter();
    }
  }

  private playEventSubvention() {
    if (this.selectedCards.length === 1 && this.selectedLocation) {
      this.gameService.playEvent(this.selectedCards[0].name, [this.selectedLocation.name]);
    }
  }

  private playEventNuitTranquille() {
    if (this.selectedCards.length === 1) {
      this.gameService.playEvent(this.selectedCards[0].name, []);
    }
  }

  private playEventPopulation() {
    if (this.selectedCards.length === 1) {
      const selectCardName = this.selectedCards[0].name;
      this.choseCards(this.gameStateView.infection_dump, 1).afterClosed().subscribe(chosenCards => {
        console.log('chosenCards', chosenCards);
        this.gameService.playEvent(selectCardName, chosenCards);
      });
    }
  }

  private playEventPrevision() {
    if (this.selectedCards.length === 1) {
      this.gameService.seeNextInfections();
    }
  }

  goFromLocation() {
    this.gameService.goFromLocation(this.selectedLocation.name);
    this.locationService.unselectLocation();
  }

  playEvent() {
    if (this.selectedCards[0] && this.selectedCards[0].type === CardType.event) {
      const eventCard = this.selectedCards[0];
      console.log('playEvent', eventCard);
      switch (eventCard.name) {
        case(EventType.subvention):
          this.playEventSubvention();
          break;
        case(EventType.nuit):
          this.playEventNuitTranquille();
          break;
        case(EventType.population):
          this.playEventPopulation();
          break;
        case(EventType.prevision):
          this.playEventPrevision();
          break;

      }
    }
    this.cardService.unSelectCards();
    this.locationService.unselectLocation();

  }


  goToLocationExpert() {
    if (this.selectedLocation && this.selectedCards && this.selectedCards.length >= 1) {
      this.gameService.goToLocationExpert(this.selectedLocation.name, this.selectedCards[0].name);
      this.locationService.unselectLocation();
      this.cardService.unSelectCards();
    }
  }

  destroyResearchCenter() {
    this.gameService.destroyResearchCenter(this.selectedLocation.name);
    this.locationService.unselectLocation();
  }

  goToLocation() {
    this.gameService.goToLocation(this.selectedLocation.name);
    this.locationService.unselectLocation();

  }


  ngOnInit(): void {
  }


  choseCards(fromCards, ncards): MatDialogRef<ChoosecardsComponent> {
    return this.dialog.open(ChoosecardsComponent, {
      width: '400px',
      data: {cards: fromCards, ncards}
    });
  }
}
