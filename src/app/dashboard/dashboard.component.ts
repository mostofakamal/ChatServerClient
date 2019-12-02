import { Component, OnInit, NgZone } from '@angular/core';
import { Message, MessageHistory } from '../../models/Message';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/TokenResponse';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'src/services/message.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'Chat Client';
  txtMessage: string = '';
  uniqueID: string = new Date().getTime().toString();
  messages = new Array<Message>();
  message = new MessageHistory();
  groups = new Array<Group>();
  messageHistory = new Array<MessageHistory>();
  selectedGroup: Group;


  constructor(  private router: Router,
    private chatService: ChatService,
    private groupService: GroupService,
    private authService: AuthenticationService,
    private messageService: MessageService,
    ) { }

  ngOnInit() {
    this.messageHistory = [];
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
      this.messageService.sendMessage(this.selectedGroup.groupId,this.txtMessage).subscribe(()=>{
        this.txtMessage = '';
      });
      

    }
  }

  selectGroup(group: Group){
    if(this.selectedGroup != null){
      this.chatService.removeFromGroup(this.selectedGroup.groupId);
    }
    if(group.isMember)
    {
      this.selectedGroup = group;
      this.chatService.connectToGroup(this.selectedGroup.groupId);
      this.messageService.getMessageHistory(this.selectedGroup.groupId).subscribe((data: any[])=>{
        this.messageHistory = data
      });
    }
  }
  joinGroup(group: Group){
       this.groupService.joinGroup(group.groupId).subscribe(()=>{
        group.isMember = true;
        this.selectGroup(group);
       });
     

  }
  leaveCurrentSelectedGroup(){
    this.groupService.leaveGroup(this.selectedGroup.groupId).subscribe(()=>{
      this.groups.find(x=>x.groupId == this.selectedGroup.groupId).isMember = false;
      this.chatService.removeFromGroup(this.selectedGroup.groupId);
      this.selectedGroup = null;
     });
  }

  onClickSubmit(formData) {
    this.groupService.createGrouop(formData.group).subscribe(()=>{
      this.loadAllGroups();
     });
 }

  private subscribeToEvents(): void {

    this.chatService.messageReceived.subscribe((message: MessageHistory) => {
      this.messageHistory.push(message);
    });
  }

  logout(): void{
     this.authService.logout();
     this.router.navigate(['/login']);
  }

}
