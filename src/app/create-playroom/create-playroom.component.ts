import {Component, OnInit} from '@angular/core';
import {SocketService} from './shared/services/socket.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-playroom',
  templateUrl: './create-playroom.component.html',
  styleUrls: ['./create-playroom.component.scss']
})
export class CreatePlayroomComponent implements OnInit {
  messages: string[] = [];
  messageContent: string;
  ioConnection: any;


  constructor(private socketService: SocketService, private router: Router) {
  }

  ngOnInit(): void {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message) => {
        console.log('got message ::', message);
        if (message.type === 'url') {
          this.navigate(message.message);
        }
      });


  }

  public startPandemic() {
    console.log('lauching new playroom');
    this.socketService.send('/new');
  }

  public navigate(url) {
    this.router.navigateByUrl(url);
  }


}
