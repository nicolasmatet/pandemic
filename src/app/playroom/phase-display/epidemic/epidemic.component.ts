import {Component, OnInit} from '@angular/core';
import {GameService} from '../../shared/services/game.service';

@Component({
  selector: 'app-epidemic',
  templateUrl: './epidemic.component.html',
  styleUrls: ['./epidemic.component.scss']
})
export class EpidemicComponent implements OnInit {

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
  }

  onClickEnd() {
    this.gameService.endTurn();
  }
}
