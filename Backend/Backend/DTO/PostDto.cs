namespace Backend.DTO
{
    public class PostDto
    {
        public string Description { get; set; }
        public List<string> Tags { get; set; } 
        public DateTime CreationDate { get; set; }
    }
}
