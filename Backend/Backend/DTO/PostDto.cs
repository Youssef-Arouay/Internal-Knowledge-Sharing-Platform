namespace Backend.DTO
{
    public class PostDto
    {
        public int PostId { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public DateTime? CreationDate { get; set; }
        public IFormFile? File { get; set; }
        public string? FilePath { get; set; }
        public string? FileContent { get; set; }



    }
}
