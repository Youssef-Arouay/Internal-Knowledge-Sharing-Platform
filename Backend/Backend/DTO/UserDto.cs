namespace Backend.DTO
{
    public class UserDto
    {
        public required int Id{ get; set; }
        public required string Firstname{ get; set; }
        public required string Lastname{ get; set; }
        public required string Username{ get; set; }
        public  string Email { get; set; }
        public int phoneNumber { get; set; }
        public string Password { get; set; }
    }

    public class UserResp
    {
        public int Id { get; set; }
        public string Username { get; set; }
    }
}
