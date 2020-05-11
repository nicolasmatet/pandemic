import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {GameRules} from '../../phase-display/phase-display.component';
import {Card} from './game.service';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  selectedCards: BehaviorSubject<Card[]>;

  constructor() {
    this.selectedCards = new BehaviorSubject<Card[]>([]);
  }

  selectCard(card: Card) {
    if (!this.isSelected(card)) {
      this.selectedCards.next([card]);
    } else {
      this.unSelectCards();
    }
  }

  isSelected(card: Card) {
    return this.selectedCards.value.includes(card);
  }

  toogleCardSelection(card: Card) {
    const allCards = this.selectedCards.getValue();
    if (this.isSelected(card)) {
      allCards.splice(allCards.indexOf(card));
    }
    else {
      allCards.push(card);
      if (allCards.length > GameRules.MAX_SELECTION) {
        allCards.shift();
      }
    }

    this.selectedCards.next(allCards);
  }

  unSelectCards() {
    this.selectedCards.next([]);
  }
}
