using Backend.DTO;
using Backend.Models;
using System.Security.Claims;

namespace Backend.Services.IServices
{
    public interface IInteractionService
    {
        Task<int?> GetUserIdByEmail(string email);
        Task<int> GetCommentCountAsync(int postId);
        Task<(bool Success, string ErrorMessage)> DeleteCommentAsync(int commentId, ClaimsPrincipal userClaims);
        Task<bool> UnsavePostAsync(int userId, int postId);
        Task<bool> SavePostAsync(int userId, int postId);
        Task<List<object>> GetSavedPostsAsync(int userId);
    }
}
