namespace Backend.DTO
{
    public class PostDto
    {
        public int PostId { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; } 
        public DateTime CreationDate { get; set; }

    }
}
