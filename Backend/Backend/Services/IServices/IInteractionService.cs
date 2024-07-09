using System.Security.Claims;

namespace Backend.Services.IServices
{
    public interface IInteractionService
    {
        Task<int?> GetUserIdByEmail(string email);
        Task<int> GetCommentCountAsync(int postId);
        Task<(bool Success, string ErrorMessage)> DeleteCommentAsync(int commentId, ClaimsPrincipal userClaims);

    }
}
