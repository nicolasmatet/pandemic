import {Inject, Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {filter} from 'rxjs/operators';


export enum MsgTypes {
  INFO = 'info',
  ERROR = 'error',
  PLAYROOMSTATE = 'playroomstate',
  GAME_STATE = 'game_state',
  GAME_SETUP = 'game_setup',
  CARD_LIST = 'cardList'
}

export interface Message {
  type: string;
  message: any;
}

@Injectable({
  providedIn: 'root'
})
export class PlayroomsocketService {
  private SERVER_URL: string;

  constructor(@Inject('environment') private environment) {
    // Support TLS-specific URLs, when appropriate.
    if (window.location.protocol === 'https:') {
      this.SERVER_URL = 'wss://' + environment.url + '/ws/pandemic/';
    } else {
      this.SERVER_URL = 'ws://' + environment.url + '/ws/pandemic/';
    }
  }

  private socket: WebSocketSubject<Message>;

  public initSocket(playroom: string): void {
    this.socket = webSocket(this.SERVER_URL + playroom);
  }

  public send(message: any): void {
    this.socket.next(message);
  }

  stream(msgType: string) {
    return this.socket.pipe(filter(msg => msg.type === msgType));

  }

}
