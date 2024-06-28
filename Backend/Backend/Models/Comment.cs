namespace Backend.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }

        // Navigation properties
        public Post Post { get; set; }  // The post that this comment belongs to
        public User User { get; set; }  // The user who commented on the post
    }
}
