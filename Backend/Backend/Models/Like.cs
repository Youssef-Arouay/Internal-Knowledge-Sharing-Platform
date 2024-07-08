namespace Backend.Models
{
    public class Like
    {
        public int LikeId { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Post Post { get; set; }  // The post that is liked
        public User User { get; set; }  // The user who liked the post
    }
}
