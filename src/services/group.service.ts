import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Group } from 'src/models/TokenResponse';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }
   
    public getAllGroups(): Observable<Group[]>{
      return this.http.get<any>(environment.apiUrl+`api/Groups`);
    }

    public joinGroup(groupdId) {
       return this.http.post<void>(environment.apiUrl+`api/Groups/groups/`+groupdId+`/player`,{});
    }

    public leaveGroup(groupdId) {
      return this.http.delete<void>(environment.apiUrl+`api/Groups/groups/`+groupdId+`/player`,{});
   }

   public createGrouop(name){
    return this.http.post<void>(environment.apiUrl+`api/Groups`,{name: name});
   }


}
