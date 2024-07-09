using Backend.Models;

namespace Backend.Services.IServices
{
    public interface IRateFileService
    {
        Task<object> RateFileAsync(int fileId, int userId);
        Task<bool> UnrateFileAsync(int fileId, int userId);
        Task<bool> HasUserRatedFileAsync(int fileId, int userId);
        Task<int?> GetUserIdByEmail(string email);
    }
}
