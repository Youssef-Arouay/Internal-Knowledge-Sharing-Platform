namespace Backend.DTO
{
    public class RegisterDto
    {

        public required string Firstname { get; set; }

        public required string Lastname { get; set; }

        public required string Email { get; set; }

        public required string Password { get; set; }

    }
}
