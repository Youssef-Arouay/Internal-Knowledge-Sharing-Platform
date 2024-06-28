using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Post
    {
        [Key]
        public int PostId { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }


        public int UserId { get; set; }

        // Navigation properties

        public User User { get; set; }  // The user who published this post
        public ICollection<Comment> Comments { get; set; }  // Comments on this post
        public ICollection<Like> Likes { get; set; }  // Likes on this post
        public ICollection<SavedPost> SavedByUsers { get; set; }  // Users who have saved this post
    }
}
