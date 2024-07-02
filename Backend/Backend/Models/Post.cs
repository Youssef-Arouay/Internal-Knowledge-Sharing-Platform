using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Post
    {
        [Key]
        public int PostId { get; set; }
        public string Description { get; set; } = string.Empty;

        /*[NotMapped]*/
        public List<string> Tags { get; set; } = new List<string>();
        public DateTime CreationDate { get; set; }


        public int UserId { get; set; }

        // Navigation properties

        public User User { get; set; }  // The user who published this post
        [JsonIgnore]
        public ICollection<Comment> Comments { get; set; }  // Comments on this post
        [JsonIgnore]
        public ICollection<Like> Likes { get; set; }  // Likes on this post
        [JsonIgnore]
        public ICollection<SavedPost> SavedByUsers { get; set; }  // Users who have saved this post


        /*public string TagsAsString
        {
            get => string.Join(",", Tags);
            set => Tags = value?.Split(',').ToList() ?? new List<string>();
        }*/

    }
}
