using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class RateFile
    {
        [Key]
        public int RateId { get; set; }
        public int FileId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }


        // Navigation properties
        public FileEntity File { get; set; }  // The post that is liked
        public User User { get; set; }  // The user who liked the post
    }
}
