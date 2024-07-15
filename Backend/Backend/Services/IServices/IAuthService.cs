using Backend.Models;

namespace Backend.Services.IServices
{
    public interface IAuthService
    {
        Task<bool> EmailExistsAsync(string email);
        Task<User> GetUserByEmailAsync(string email);
        bool IsValidEmail(string email);
        bool IsValidPassword(string password);
        bool VerifyPassword(string password, string passwordHash);

        string CreateToken(User user);
    }
}
