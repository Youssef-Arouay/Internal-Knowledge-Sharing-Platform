export interface userRegister {
    firstname: string;
    lastname: string;
    email: string;
    password: string
}

export interface usercred {
    id: number,
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string
}

export interface loginReq {
    email: string;
    password: string;
}

export interface loginresp {
    token: any;
    user: usercred;
}

export interface postDetails {
    id: number,
    description: string,
    tags: string,
    creationDate : string,
}