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
    firstName: string; // Adjust the type according to your backend response
    lastName: string; // Adjust the type according to your backend response
    entityName: string; // Adjust the type according to your backend response
    file: File | null; // Adjust according to your application's needs
    position: number;
    author: string;
    name: string;
    description: string;
    version: string;
    uploadDate: string; // Adjust the type as needed (e.g., Date)
    downloads: number;
    rates: number;
    tags: string[]; // Adjust as per your data structure
  }
  
  
  
  
  