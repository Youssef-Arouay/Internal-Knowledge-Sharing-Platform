namespace Backend.DTO
{
    public class FileDto
    {
        public string EntityName { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public string Version { get; set; }
    }
    public class FileDtoResp
    {
        public int Id { get; set; }
        public string EntityName { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public string Version { get; set; }
        public DateTime UploadDate { get; set; }
        public int Downloads { get; set; }
        public int Rates { get; set; }
        public List<UserResp> RatedByUsers { get; set; }
        public string FirstName { get; set; } // Add FirstName of user ( owner )
        public string LastName { get; set; }  // Add LastName
    }
}
