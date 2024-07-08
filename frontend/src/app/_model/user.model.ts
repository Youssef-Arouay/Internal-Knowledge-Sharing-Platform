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
    tags: string[],
    creationDate : string,
}

export interface postCommentReq {
    postId: string,
    content: string,
}

export interface fileForm {
  file: File | null ;
  fileName: string ;
  description: string;
  version: string ;
  tags: string[] ;
}

export interface FileElement {
    id: number ;
    firstName: string; 
    lastName: string; 
    entityName: string; 
    file: File | null; 
    position: number;
    author: string;
    name: string;
    description: string;
    version: string;
    uploadDate: string; 
    downloads: number;
    rates: number;
    tags: string[]; 
  }
  
  
  
  
  