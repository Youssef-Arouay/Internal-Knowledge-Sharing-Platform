namespace Backend.DTO
{
    public class CommentDto
    {
        public int PostId { get; set; }
        public string Content { get; set; }

        public DateTime CreationDate { get; set; }

    }
}
