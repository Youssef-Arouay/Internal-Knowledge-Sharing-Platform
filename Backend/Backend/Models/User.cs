using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Firstname { get; set; } = string.Empty;
        public string Lastname{ get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public DateTime CreationDate { get; set; }
        public string? PhoneNumber { get; set; } = string.Empty;
        public byte[]? ProfileImage { get; set; }
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation property for files uploaded by this user

        [JsonIgnore]
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        [JsonIgnore]
        public ICollection<SavedPost> SavedPosts { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>(); 
        public ICollection<Like> Likes { get; set; } = new List<Like>(); 
        public ICollection<FileEntity> Files { get; set; } = new List<FileEntity>();
        public ICollection<RateFile> RateFiles { get; set; } = new List<RateFile>();
    }
}
