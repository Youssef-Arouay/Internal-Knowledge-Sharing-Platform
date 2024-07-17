namespace Backend.DTO
{
    public class UserDto
    {
        public required int Id{ get; set; }
        public required string Firstname{ get; set; }
        public required string Lastname{ get; set; }
        public required string Username{ get; set; }
        public  string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }

        public string Password { get; set; }
        public int PostsCount { get; set; }
        public int FilesCount { get; set; }
        public int InteractionsCount { get; set; }
    }

    public class UserResp
    {
        public int Id { get; set; }
        public string Username { get; set; }
    }

    public class UpdateUserDto
    {
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? Username { get; set; }
        public string? PhoneNumber { get; set; } 
        public DateTime? BirthDate { get; set; }
        public IFormFile? ProfileImage { get; set; } 
    }
}
