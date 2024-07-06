namespace Backend.DTO
{
    public class FileDto
    {

        public string FileName { get; set; }
        public string EntityName { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public string Version { get; set; }
    }
}
