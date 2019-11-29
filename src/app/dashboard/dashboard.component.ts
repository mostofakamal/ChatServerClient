import { Component, OnInit, NgZone } from '@angular/core';
import { Message } from 'src/models/Message';
import { ChatService } from 'src/services/chat.service';
import { Router } from '@angular/router';
import { GroupService } from 'src/services/group.service';
import { Group } from 'src/models/TokenResponse';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'ClientApp';
  txtMessage: string = '';
  uniqueID: string = new Date().getTime().toString();
  messages = new Array<Message>();
  message = new Message();
  groups = new Array<Group>();

  constructor(  private router: Router,
    private chatService: ChatService,
    private groupService: GroupService,
    private authService: AuthenticationService,
    private _ngZone: NgZone) { }

  ngOnInit() {
     this.subscribeToEvents();
     this.authService.currentUser.subscribe(r=>{
      this.loadAllGroups();
     });
    
  }

  private loadAllGroups(): void{
     this.groupService.getAllGroups().subscribe((data: any[])=>{
      this.groups = data;
    })
  }

  sendMessage(): void {
    if (this.txtMessage) {
      this.message = new Message();
      this.message.clientuniqueid = this.uniqueID;
      this.message.type = "sent";
      this.message.message = this.txtMessage;
      this.message.date = new Date();
      this.messages.push(this.message);
      this.chatService.sendMessage(this.message);
      this.txtMessage = '';
    }
  }
  private subscribeToEvents(): void {

    this.chatService.messageReceived.subscribe((message: Message) => {
      this._ngZone.run(() => {
        if (message.clientuniqueid !== this.uniqueID) {
          message.type = "received";
          this.messages.push(message);
        }
      });
    });
  }

}
