import {Component, Input, OnInit} from '@angular/core';

export enum GamePhase {
  NOT_STARTED = 'not_started',
  PLAYER_ACTION = 'player_action',
  DUMP_CARD = 'dump_card',
  SOLVE_EPIDEMIC = 'solve_epidemic',
  DEFEAT = 'defeat',
  VICTORY = 'victory',
  DESTROY = 'destroy',
  END_TURN = 'end_turn'
}

export enum GameRules {
  MAX_ACTIONS = 4,
  MAX_CARDS = 7,
  MAX_SELECTION = 5,
  N_CARDS_TO_CURE = 4
}

@Component({
  selector: 'app-phase-display',
  templateUrl: './phase-display.component.html',
  styleUrls: ['./phase-display.component.scss']
})
export class PhaseDisplayComponent implements OnInit {
  gameRules = GameRules;
  gamePhases = GamePhase;
  @Input() gameStateView;

  constructor() {
  }

  ngOnInit(): void {
  }

}
