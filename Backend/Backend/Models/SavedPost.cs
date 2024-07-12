namespace Backend.Models
{
    public class SavedPost
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public DateTime SaveDate { get; set; }

        // Navigation properties
        public Post Post { get; set; }  // The post that is saved
        public User User { get; set; }  // The user who saved the post
    }
}
