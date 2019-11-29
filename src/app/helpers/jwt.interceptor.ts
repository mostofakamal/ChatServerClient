import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let tokenResponse = this.authenticationService.currentUserValue;
        if (tokenResponse && tokenResponse.accessToken) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${tokenResponse.accessToken}`
                }
            });
        }
        else{
           console.log("token is null: "+ JSON.stringify(localStorage.getItem("currentUser")));

        }

        return next.handle(request);
    }
}