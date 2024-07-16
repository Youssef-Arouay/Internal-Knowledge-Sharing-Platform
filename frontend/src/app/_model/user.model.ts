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
    firstname: string,
    lastname: string,
    username: string,
    phoneNumber: number,
    email: string,
    password: string,
    postsCount:number,
    filesCount: number,
    interactionsCount: number
}
export interface User {
    id: number,
    firstname: string,
    lastname: string,
    username: string,
    phoneNumber: number,
    email: string,
    password: string
}

export interface postDetails {
    id: number,
    description: string,
    tags: string[],
    creationDate : string,
}

export interface postCommentReq {
    postId: string,
    content: string,
}

  
  
  
  
  