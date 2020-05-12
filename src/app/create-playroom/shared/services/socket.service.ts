import {Inject, Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';


export interface Message {
  type: string;
  message: any;
}

@Injectable()
export class SocketService {
  private socket: WebSocketSubject<Message>;
  private SERVER_URL: string;

  constructor(@Inject('environment') private environment) {
    if (window.location.protocol === 'https:') {
      this.SERVER_URL = 'wss://' + environment.url + '/ws/pandemic/';
    } else {
      this.SERVER_URL = 'ws://' + environment.url + '/ws/pandemic/';
    }
  }

  public initSocket(): void {
    this.socket = webSocket(this.SERVER_URL);

  }

  public send(message: any): void {
    console.log('sending', message, 'to', this.SERVER_URL);
    this.socket.next(message);
  }

  public onMessage() {
    return this.socket;
  }

}
