export interface fileForm {
    file: File | null;
    fileName: string;
    description: string;
    version: string;
    tags: string[];
}

export interface FileElement {
    id: number;
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
    ratedByUsers: any;
    // hasRated : boolean;
}