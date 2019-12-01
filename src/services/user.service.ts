import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models/TokenResponse';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
      return this.http.get<User[]>(`/users`);
  }

  register(user: User): Observable<any> {
    //TODO:
    https://stackblitz.com/edit/angular-8-registration-login-example?file=app%2Fregister%2Fregister.component.ts
      return this.http.post( environment.apiUrl+`api/Accounts`, user);
  }

  delete(id: number) {
      return this.http.delete(`/users/${id}`);
  }
}
