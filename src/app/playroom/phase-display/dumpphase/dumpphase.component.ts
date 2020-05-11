import {Component, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {GameState} from '../../shared/services/game.service';
import {GameRules} from '../phase-display.component';


@Pipe({name: 'getDumpContext'})
export class GetDumpContext implements PipeTransform {
  transform(gameStateView: GameState): { 'player': string, 'nCards': number } {
    if (gameStateView && gameStateView.player_hands) {

      for (const player of Object.keys(gameStateView.player_hands)) {
        const hand = gameStateView.player_hands[player];
        if (hand && hand.length > GameRules.MAX_CARDS) {
          const nCards = hand.length - GameRules.MAX_CARDS;
          return {player, nCards};
        }
      }
    }
    return {player: '', nCards: 0};
  }
}


@Component({
  selector: 'app-dumpphase',
  templateUrl: './dumpphase.component.html',
  styleUrls: ['./dumpphase.component.scss']
})
export class DumpphaseComponent implements OnInit {

  @Input() message;

  constructor() {
  }

  ngOnInit(): void {
  }

}
