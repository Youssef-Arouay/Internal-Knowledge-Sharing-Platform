import { User } from './user.model'
export interface Like {
    $id: string;
    likeId: number;
    userId: number;
    user: User;
}

export interface Tags {
    $id: string;
    $values: any[]; // Adjust if you have a specific tag structure
}

export interface Post {
    $id: string;
    postId: number;
    description: string;
    tags: Tags;
    creationDate: string;
    userId: number;
    user: User;
    likes: {
        $id: string;
        $values: Like[];
    };
    commentCount: number;
}

export interface MyPostsResp {
    $id: string;
    $values: Post[];
}

export interface postDetails {
    id: number,
    description: string,
    tags: string[],
    // creationDate : string,
    file: File | null;
}

export interface postCommentReq {
    postId: string,
    content: string,
}
