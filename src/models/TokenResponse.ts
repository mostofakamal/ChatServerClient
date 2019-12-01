export class TokenResponse {
       /**
        *
        */
       constructor(accessToken: AccessToken, refreshToken: string) {
               this.accessToken = accessToken;
               this.refreshToken = refreshToken;
       }
        accessToken: AccessToken;
        refreshToken: string;

}

export class AccessToken
{
   token: string;
   expiresIn: string;
}

export class User{
        firstName: string;
        lastName: string;
        email: string;
        userName: string;
        password: string;
}


export class Group{

        groupId: number;
        name: string;
        isMember : boolean
}