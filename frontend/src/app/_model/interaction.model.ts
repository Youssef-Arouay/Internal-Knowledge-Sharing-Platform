export interface savedPosts{
    $id: number;
    id: number;
    postId: number;
    userId: number;
    posts: any[];
    $values:any[];
}


export interface savedPostsResp{
    $id: number;
    $values: savedPosts[];
}