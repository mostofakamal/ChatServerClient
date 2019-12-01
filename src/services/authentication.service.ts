import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenResponse } from 'src/models/TokenResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<TokenResponse>;
  public currentUser: Observable<TokenResponse>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<TokenResponse>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): TokenResponse {
      return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    
      return this.http.post<any>(environment.apiUrl+`api/Auth/login`, { username, password })
          .pipe(map(tokenResponse => {
              // login successful if there's a jwt token in the response
              if (tokenResponse && tokenResponse.accessToken) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  console.log("Storing token in currentuser")
                  localStorage.setItem('currentUser', JSON.stringify(tokenResponse));
                  this.currentUserSubject.next(tokenResponse);
              }

              return tokenResponse;
          }));
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}
