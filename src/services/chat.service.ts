import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { MessageHistory, Message } from 'src/models/Message';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ChatService {
  messageReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<Boolean>();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor(private authService: AuthenticationService) {
    this.authService.currentUser.subscribe(r=>{
      this.createConnection();
      this.registerOnServerEvents();
      this.startConnection();
     });
   
  }

  sendMessage(message: MessageHistory) {
    this._hubConnection.invoke('NewMessage', message);
    this._hubConnection.invoke('GetConnectionId').then((x) => {
      console.log("ConnectionId: " + x);
    });
  }

  connectToGroup(groupId) {
    this._hubConnection.invoke('ConnectToGroup', groupId);
   
  }

  removeFromGroup(groupId){
    this._hubConnection.invoke('RemoveFromGroup', groupId);
    
  }

  private createConnection() {
    let tokenResponse = this.authService.currentUserValue;
    if(tokenResponse&& tokenResponse.accessToken){
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiUrl + 'MessageHub', {
        accessTokenFactory: () => tokenResponse.accessToken.token
      })
      .build();
    }
  }

  private startConnection(): void {
    console.log("Starting the connection");
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
        this._hubConnection.invoke('GetConnectionId').then((x) => {
          console.log("ConnectionId: " + x);
        });
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(function () { this.startConnection(); }, 5000);
      });

   
  }

  private registerOnServerEvents(): void {
    this._hubConnection.on('MessageReceived', (data: any) => {
      this.messageReceived.emit(data);
    });
  }
}  
