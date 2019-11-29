import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';

@Injectable()
export class ChatService {
  messageReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<Boolean>();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor() {
   this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  sendMessage(message: Message) {
    this._hubConnection.invoke('NewMessage', message);
    this._hubConnection.invoke('GetConnectionId').then((x) => {
      console.log("ConnectionId: " + x);
    });
  }

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiUrl + 'MessageHub', {
        accessTokenFactory: () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdW1vbiIsImp0aSI6ImJmYjg0YTM3LTUxNmQtNDcyYi1iNGJkLWU4NGVjMGJmZmExNCIsImlhdCI6MTU3NDQxOTI5Miwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiODViYzQ1ZjMtYTMzNC00MjY0LTlhYWUtNmYwY2MyNjg0ZWZmIiwibmJmIjoxNTc0NDE5MjkxLCJleHAiOjE1NzQ0MjY0OTEsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC8ifQ.uctl8Ooc6M_e1NNbnVY7UDHt0PskLCqvHeJAbMBuZkk'
      })
      .build();
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
