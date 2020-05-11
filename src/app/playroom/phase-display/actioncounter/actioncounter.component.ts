import {Component, Input, OnInit} from '@angular/core';
import {GameService} from '../../shared/services/game.service';
import {GameRules} from '../phase-display.component';

@Component({
  selector: 'app-actioncounter',
  templateUrl: './actioncounter.component.html',
  styleUrls: ['./actioncounter.component.scss']
})
export class ActioncounterComponent implements OnInit {
  gameRules = GameRules;
  @Input() gameStateView;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
  }

  onClickEnd() {
    this.gameService.endTurn();
  }
}
