namespace Backend.DTO
{
    public class savedPostDto
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public DateTime SaveDate { get; set; }

        public List<PostDto> Posts { get; set; } = new List<PostDto>();

    }
}
