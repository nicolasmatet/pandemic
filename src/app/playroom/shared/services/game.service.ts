import {Injectable} from '@angular/core';
import {MsgTypes, PlayroomsocketService} from './playroomsocket.service';
import {ReplaySubject} from 'rxjs';

export enum PlayerRoles {
  MEDECIN = 'medecin',
  CHERCHEUSE = 'chercheuse',
  EXPERT = 'expert',
  SPECIALISTE = 'specialiste',
  PLANIFICATEUR = 'planificateur',
  SCIENTIFIQUE = 'scientifique',
  REPARTITEUSE = 'repartiteuse'

}

export enum DiseaseStatus {
  ONGOING = 'ongoing',
  CURED = 'cured',
  ERADICATED = 'eradicated'
}

export enum CardType {
  red = 'red',
  blue = 'blue',
  black = 'black',
  yellow = 'yellow',
  event = 'event'
}

export enum EventType {
  pont = 'Pont Aérien',
  subvention = 'Subvention Publique',
  nuit = 'Nuit Tranquille',
  population = 'Population Résiliente',
  prevision = 'Prévision'
}

export interface Card {
  name: string;
  type: string;
}

export interface MapLocation {
  name: string;
  location_type: string;
  population: number;
  x: number;
  y: number;
}


export interface PlayRoomState {
  players?: Player[];
  has_started?: boolean;
  player?: Player;
}

export interface Player {
  name: string;
  is_ready: boolean;
  taken: boolean;
  role: string;
}


export interface PlayerView {
  name: string;
  role: string;
  bluecards: string[];
  redcards: string[];
  blackcards: string[];
  yellowcards: string[];
  iscurrent: boolean;
  location: string;
  isSelf: boolean;
  newCards: string[];
  dragPosition?: { x: number, y: number }
}

export interface GameSetup {
  locations: any;
}

export interface Disease {
  status: string;
  count: number;
  type: string;
}

export interface GameState {
  player_roles?: any;
  player_locations?: any;
  player_hands?: string[];
  locations_disease_count?: any;
  locations_research_center?: any;
  disease_status?: Disease[];
  location_deck_count?: number;
  infection_deck_count?: number;
  location_dump?: string [];
  infection_dump?: string[];
  epidemics?: number;
  outbreaks?: number;
  phase?: string;
  epidemics_to_solve?: number;
  player_actions?: number;
  current_player?: string;
  locations_types?: any;
  cancellable?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private typeOrder = new Map<string, number>([
    [CardType.black, 0],
    [CardType.blue, 1],
    [CardType.red, 2],
    [CardType.yellow, 3],
    [CardType.event, 4],
    [null, 100]
  ]);
  private gameState: GameState = null;
  private gameSetup: GameSetup = null;
  private playroomState: PlayRoomState = null;

  playroomView: ReplaySubject<PlayRoomState>;
  playerViews: ReplaySubject<PlayerView[]>;
  gameSetupView: ReplaySubject<GameSetup>;
  gameStateView: ReplaySubject<GameState>;

  constructor(private socket: PlayroomsocketService) {
    this.playerViews = new ReplaySubject(1);
    this.playroomView = new ReplaySubject(1);
    this.gameSetupView = new ReplaySubject(1);
    this.gameStateView = new ReplaySubject(1);

  }


  public startListening(playroom) {
    this.socket.initSocket(playroom);
    this.socket.stream(MsgTypes.GAME_STATE).subscribe(msg => {

      console.log(msg.type, msg.message);
      const newgamestate = JSON.parse(msg.message);
      this.gameState = this.updateObjectState(this.gameState, newgamestate);

      const newplayerViews = this.getPlayerViews(this.gameState);
      this.playerViews.next(newplayerViews);

      this.gameStateView.next(this.gameState);

      // this.gameStateView.next(this.gameState);
    });

    this.socket.stream(MsgTypes.PLAYROOMSTATE).subscribe(msg => {
      const newPlayroomstate: PlayRoomState = JSON.parse(msg.message);
      this.playroomState = this.updateObjectState(this.playroomState, newPlayroomstate);
      this.playroomView.next(this.playroomState);
    });


    this.socket.stream(MsgTypes.GAME_SETUP).subscribe(msg => {
      console.log(msg.type, JSON.parse(msg.message));
      this.gameSetup = JSON.parse(msg.message);
      this.gameSetupView.next(this.gameSetup);
    });


  }


  canGiveCard(fromPlayer: string, toPlayer: string, card: Card) {
    if (!this.gameState) {
      return false;
    }

    if (card.type === null || card.type === undefined || card.type === CardType.event) {
      return false;
    }

    const cardLocation = card.name;
    const isChercheuse = this.gameState.player_roles[fromPlayer] === PlayerRoles.CHERCHEUSE;
    const goodLocation = isChercheuse || this.getPlayerLocation(fromPlayer) === cardLocation;
    return this.playersAreInSameLocation(fromPlayer, toPlayer) && goodLocation;

  }

  playersAreInSameLocation(fromPlayer: string, toPlayer: string) {
    const fromPlayerLocation = this.getPlayerLocation(fromPlayer);
    const toPlayerLocation = this.getPlayerLocation(toPlayer);
    return fromPlayerLocation === toPlayerLocation;
  }

  getPlayerLocation(player: string) {
    return this.gameState.player_locations[player];
  }


  public currentPlayer(): Player {
    return this.playroomState.player;
  }

  public currentPlayerLocation(): MapLocation {
    if (this.currentPlayer()) {
      return this.toMapLocation(this.gameState.player_locations[this.currentPlayer().name]);
    }
  }

  private toMapLocation(name: string): MapLocation {
    return this.gameSetup.locations[name];
  }


  public kickPlayer(playername) {
    console.log('/kick ' + playername);
    this.socket.send('/kick ' + playername);
  }

  public joinGameAs(playername) {
    console.log('/join ' + playername);
    this.socket.send('/join ' + playername);
  }

  public chooseRole(role) {
    console.log('/role ' + role);
    this.socket.send('/role ' + role);
  }

  public readyPlayer(isReady: boolean) {
    if (isReady) {
      this.socket.send('/ready');
    }
    else {
      this.socket.send('/unready');
    }
  }

  public onStartGame() {
    this.socket.send('/start');
  }

  public getGameSetup() {
    this.socket.send('/gamesetup');
  }

  public getGameState() {
    this.socket.send('/gamestate');
  }

  public getPlayroomState() {
    this.socket.send('/playroomstate');
  }

  public move(location: string, player?: string) {
    if (player) {
      this.socket.send('/move ' + player + ' | ' + location);
    }
    else {
      this.socket.send('/move ' + location);
    }
  }

  public heal() {
    this.socket.send('/heal');
  }

  public dumpCard(cards: string[]) {
    if (cards.length === 1) {
      this.socket.send('/dump ' + cards[0]);
    } else if (cards.length >= 2) {
      this.socket.send('/dump ' + cards[0] + ' | ' + cards[1]);

    }
  }

  public cancelLastAction() {
    this.socket.send('/cancel');
  }

  public endTurn() {
    this.socket.send('/end');
  }

  public buildResearchCenter() {
    this.socket.send('/build');

  }

  public destroyResearchCenter(location: string) {
    this.socket.send('/destroy ' + location);
  }

  public goFromLocation(toLocation: string) {
    this.socket.send('/movefrom ' + toLocation);

  }

  public goToLocationExpert(toLocation: string, card: string) {
    this.socket.send('/movetoexpert ' + toLocation + ' | ' + card);
  }

  public goToLocation(toLocation) {
    this.socket.send('/moveto ' + toLocation);

  }

  public cureDisease(cards: string[]) {
    this.socket.send('/cure ' + cards.join('&'));

  }

  public playEvent(card: string, args: string[]) {
    this.socket.send('/playevent ' + card + ' | ' + args.join('&'));
  }

  public giveCard(fromPlayer: string, toPlayer: string, card: string) {
    this.socket.send('/give ' + fromPlayer + '&' + toPlayer + '&' + card);
  }


  public seeNextInfections() {
    this.socket.send('/seenextinfections');
    this.socket.send('/gamestate');
  }

  public setNextInfections(secret: string, cards: string[]) {
    this.socket.send('/setnextinfections ' + secret + ' | ' + cards.join('&'));
  }

  public updateObjectState(oldObject, newObject): any {
    const updatedObject = {};
    if (oldObject !== null && oldObject !== undefined) {
      for (const key of Object.keys(oldObject)) {
        updatedObject[key] = oldObject[key];
      }
    }
    if (newObject !== null && newObject !== undefined) {
      for (const key of Object.keys(newObject)) {
        updatedObject[key] = newObject[key];
      }
    }
    return updatedObject;

  }


  private getPlayerViews(gameState: GameState): PlayerView[] {
    const playerViews = [];
    const playerRoles = gameState.player_roles;
    const playerCards = gameState.player_hands;
    const playerLocations = gameState.player_locations;

    console.log('playerCards', playerCards);
    const currentPlayer = gameState.current_player;
    if (playerRoles) {


      for (const player of Object.keys(playerRoles)) {
        const role = playerRoles[player];
        const cards = playerCards[player];
        const location = playerLocations[player];
        const iscurrent = player === currentPlayer;
        const isSelf = (this.playroomState !== null && this.playroomState.player !== null && player === this.playroomState.player.name);
        const bluecards = [];
        const blackcards = [];
        const redcards = [];
        const yellowcards = [];
        const eventcards = [];
        const newCards = [];
        const allCards = this._getListCardsObjects(cards, gameState.locations_types);
        const newPLayerView = {
          name: player,
          role,
          location,
          iscurrent,
          isSelf,
          allCards
        };
        playerViews.push(newPLayerView);

      }
    }
    console.log('update playerViews', playerViews);

    return playerViews;
  }

  private _getListCardsObjects(cards: string[], locationTypes: any): Card[] {
    const allCards: Card[] = [];
    if (!cards) {
      return allCards;
    }
    for (const card of cards) {
      let type = locationTypes[card];
      if (type === undefined || type === null) {
        type = CardType.event;
      }
      allCards.push({name: card, type});
    }

    allCards.sort((c1, c2) => this.typeOrder.get(c1.type) - this.typeOrder.get(c2.type));

    console.log('**************allCards', allCards);
    return allCards;
  }

  private _sortCards(cards: string[], locationTypes: any, bluecards: string[], blackcards: string[],
                     redcards: string[], yellowcards: string[], eventcards: string[]) {

    for (const card of cards) {
      switch (locationTypes[card]) {
        case CardType.black:
          blackcards.push(card);
          break;
        case CardType.blue:
          bluecards.push(card);
          break;
        case CardType.red:
          redcards.push(card);
          break;
        case CardType.yellow:
          yellowcards.push(card);
          break;
        default:
          eventcards.push(card);
          break;

      }

    }
  }
}

