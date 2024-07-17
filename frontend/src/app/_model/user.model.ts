export interface userRegister {
    firstname: string;
    lastname: string;
    email: string;
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

export interface usercred {
    id: number,
    imageProfile: File | null;
    firstname: string,
    lastname: string,
    username: string,
    phoneNumber: string,
    birthDate: string,
    email: string,
    password: string,
    postsCount:number,
    filesCount: number,
    interactionsCount: number
}

export interface profileForm {
    imageProfile: File | null;
    firstname: string,
    lastname: string,
    username: string,
    phoneNumber: string,
    birthDate: string,
    email: string
}

export interface User {
    id: number,
    imageProfile: File | null;
    firstname: string,
    lastname: string,
    username: string,
    phoneNumber: string,
    birthDate: string,
    email: string,
    password: string
}



  
  
  
  
  