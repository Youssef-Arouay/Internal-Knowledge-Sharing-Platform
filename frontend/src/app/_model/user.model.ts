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
    profileImage: File | null;
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
    profileImage: File | null;
    firstname: string,
    lastname: string,
    username: string,
    phoneNumber: string,
    birthDate: string,
}

export interface User {
    id: number,
    profileImage: File | null;
    firstname: string,
    lastname: string,
    username: string,
    phoneNumber: string,
    birthDate: string,
    email: string,
    password: string
}



  
  
  
  
  