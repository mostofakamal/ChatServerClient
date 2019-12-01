import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageHistory } from 'src/models/Message';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  public getMessageHistory(groupId):Observable<MessageHistory[]>{
    return this.http.get<any>(environment.apiUrl+'api/Messages/groups/'+groupId);
  }


  public sendMessage(groupdId,message) {
    return this.http.post<void>(environment.apiUrl+`api/Messages/groups/`+groupdId,{message:message});
 }
}
