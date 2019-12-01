import { Component, NgZone,OnInit } from '@angular/core';
import { Message } from '../models/Message';
import {} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'ClientApp';
  txtMessage: string = '';
  uniqueID: string = new Date().getTime().toString();
  messages = new Array<Message>();
  message = new Message();
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    let tokenResponse = this.authenticationService.currentUserValue;
    if (tokenResponse && tokenResponse.accessToken) {
      this.router.navigate(['/dashboard']);
    }
    else{
      this.router.navigate(['/login']);
    }
  }

}
