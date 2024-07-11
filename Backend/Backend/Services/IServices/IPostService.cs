using Backend.DTO;
using Backend.Models;
using System.Security.Claims;

namespace Backend.Services.IServices
{
    public interface IPostService
    {

        Task<int?> GetUserIdByEmail(string email);
        Task<(bool Success, Post Post, string ErrorMessage)> AddPostAsync(PostDto createPostDto, ClaimsPrincipal userClaims);
        Task<(bool Success, string ErrorMessage)> DeletePostAsync(int postId, ClaimsPrincipal userClaims);
        Task<List<object>> GetAllPostsAsync();
        Task<List<object>> GetMyPostsAsync(int userId);
        Task<int> GetCommentCountAsync(int postId);
    }
}
