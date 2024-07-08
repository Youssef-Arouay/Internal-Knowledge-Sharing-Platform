using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class FileEntity
    {
        [Key]
        public int Id { get; set; }
        public string FileName { get; set; }
        public string EntityName { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public string Version { get; set; }
        public DateTime UploadDate { get; set; }
        public int Downloads { get; set; }
        public int Rates { get; set; }

        // Foreign key to User
        public int UserId { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
