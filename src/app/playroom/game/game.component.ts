import {AfterViewInit, Component, Input, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {Card, CardType, DiseaseStatus, EventType, GameService, GameState, MapLocation, PlayerView} from '../shared/services/game.service';
import {kdTree} from 'kd-tree-javascript';
import {LocationService} from '../shared/services/location.service';
import {CardsService} from '../shared/services/cards.service';
import {ChoosecardsComponent} from '../choosecards/choosecards.component';
import {MatDialog} from '@angular/material/dialog';

@Pipe({name: 'mapToArray'})
export class MapToArray implements PipeTransform {
  transform(value, args: string[]): any {
    const arr = [];
    for (const key of Object.keys(value)) {
      arr.push({key, value: value[key]});
    }
    return arr;
  }
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapRef;
  DX = 7.53;
  DY = 4.35;
  DRBIG = 50;
  DRSMALL = 10;
  DR = this.DRSMALL;

  dictLocations: any;
  @Input() gameStateView: GameState;
  playerViews: PlayerView[] = [];
  kdtree: any;
  points = [];
  diseaseStatus = DiseaseStatus;
  cardTypes = CardType;
  selectedLocation: MapLocation = null;
  selectedCards: Card[] = [];
  thetas = {0: 0, 1: Math.PI, 2: Math.PI / 2, 3: -Math.PI / 2, 4: 0, 5: 0, 6: 0};

  constructor(private gameService: GameService,
              private locationService: LocationService,
              private cardService: CardsService) {
    this.locationService.selectedLocation.subscribe(location => {
      this.selectedLocation = location;
    });
    this.cardService.selectedCards.subscribe(cards => {
      this.selectedCards = cards;
    });
  }


  getNearestLocation(x, y) {
    console.log('nearsest of', x, y);
    const res = this.kdtree.nearest({x: x, y: y}, 1, 500)[0];
    console.log('nearsest is', res);

    if (res) {

      return res[0];
    }
    return null;
  }

  distance(obj1, obj2) {
    return (obj1.x - obj2.x) * (obj1.x - obj2.x) + (obj1.y - obj2.y) * (obj1.y - obj2.y);
  }

  ngOnInit(): void {

    this.gameService.gameSetupView.subscribe(gameSetupView => {
      this.dictLocations = gameSetupView.locations;
      const points = Object.values(this.dictLocations);
      this.points = points;
      //@ts-ignore
      this.kdtree = new kdTree(points, this.distance, ['x', 'y']);
    });


  }

  ngAfterViewInit() {

    this.gameService.playerViews.subscribe(playerViews => {
      console.log('GameComponent playerViews', playerViews);
      console.log('GameComponent dictLocations', this.dictLocations);
      this.updatePlayersDragLocation(playerViews, this.DR);
      this.playerViews = playerViews;
    });
  }

  public toogleDR() {
    if (this.DR < this.DRBIG) {
      this.DR = this.DRBIG;
    } else {
      this.DR = this.DRSMALL;
    }

    this.updatePlayersDragLocation(this.playerViews, this.DR);


  }

  public updatePlayersDragLocation(playerViews, dr: number) {

    const playersAtLocation = new Map<string, PlayerView[]>();
    console.log('************** playersAtLocation', playersAtLocation);

    for (const player of playerViews) {
      if (playersAtLocation.has(player.location)) {
        playersAtLocation.get(player.location).push(player);
      } else {
        playersAtLocation.set(player.location, [player]);
      }
    }
    console.log('************** playersAtLocation', playersAtLocation);

    for (const playerGroup of playersAtLocation.values()) {
      playerGroup.map((player, idx) => {
        const theta = this.thetas[idx];
        const dx = dr * Math.cos(theta);
        const dy = dr * Math.sin(theta);
        player.dragPosition = {
          x: this.dictLocations[player.location].x / this.DX * this.mapRef.nativeElement.offsetWidth / 100 + dx - dr / 2,
          y: this.dictLocations[player.location].y / this.DY * this.mapRef.nativeElement.offsetHeight / 100 + dy
        };
      });
    }


  }

  getMapX(x, mapWidth: number) {
    return Math.floor(x / mapWidth * this.DX * 100);
  }

  getMapY(y, mapHeight) {
    return Math.floor(y / mapHeight * this.DY * 100);
  }

  onClickMap(event) {

    const x = this.getMapX(event.offsetX, event.path[0].width);
    const y = this.getMapY(event.offsetY, event.path[0].height);
    const nearest = this.getNearestLocation(x, y);

    if (event.ctrlKey) {
      this.selectLocation(nearest);
    }
    else {
      this.locationAction(nearest);
    }

  }

  locationAction(location) {
    if (location) {
      const playerLocation = this.gameService.currentPlayerLocation();
      if (!playerLocation) {
        return;
      }
      if (playerLocation.name === location.name) {
        this.gameService.heal();
      } else {
        this.gameService.move(location.name);
      }
    } else {
      this.locationService.unselectLocation();
    }
  }

  selectLocation(location) {
    if (location) {
      this.locationService.selectLocation(location);
    } else {
      this.locationService.unselectLocation();
    }
  }

  dropPlayer(event) {
    console.log('drop', event);
    const distance = event.distance;
    const dragedPlayer: PlayerView = event.item.data;
    const previousPosition = dragedPlayer.dragPosition;
    const previousLocationName: string = dragedPlayer.location;
    const newMapX = this.getMapX(previousPosition.x + distance.x, event.container.element.nativeElement.offsetWidth);
    const newMapY = this.getMapY(previousPosition.y + distance.y, event.container.element.nativeElement.offsetHeight);
    const nearest = this.getNearestLocation(newMapX, newMapY);
    if (nearest) {

      if (nearest.name !== previousLocationName) {
        this.movePlayer(dragedPlayer.name, nearest.name);

      } else {
        dragedPlayer.dragPosition = {
          x: dragedPlayer.dragPosition.x + event.distance.x,
          y: dragedPlayer.dragPosition.y + event.distance.y
        };

      }
    }
  }

  movePlayer(playerName, toLocation) {
    if (this.selectedCards.length === 1 && this.selectedCards[0].name === EventType.pont) {
      this.gameService.playEvent(this.selectedCards[0].name, [toLocation, playerName]);
      this.cardService.unSelectCards();
    } else {
      this.gameService.move(toLocation, playerName);
    }

  }




}
