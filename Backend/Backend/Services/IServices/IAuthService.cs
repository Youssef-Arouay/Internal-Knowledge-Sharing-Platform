using Backend.Models;

namespace Backend.Services.IServices
{
    public interface IAuthService
    {
        Task<bool> EmailExistsAsync(string email);
        Task<User> GetUserByEmailAsync(string email);

    }
}
