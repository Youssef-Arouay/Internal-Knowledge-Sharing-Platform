using Backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Services
{
    public class InteractionService
    {
        private readonly ApplicationDbContext _context;

        public InteractionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int?> GetUserIdByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return user?.Id;
        }

        public async Task<(bool Success, string ErrorMessage)> DeleteCommentAsync(int commentId, ClaimsPrincipal userClaims)
        {
            try
            {
                var email = userClaims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

                if (email == null)
                {
                    return (false, "Unauthorized: Email claim not found.");
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null)
                {
                    return (false, "Unauthorized: User not found.");
                }

                var comment = await _context.Comments.FindAsync(commentId);

                if (comment == null)
                {
                    return (false, "Comment not found.");
                }

                if (comment.UserId != user.Id)
                {
                    return (false, "Forbidden: User does not own the comment.");
                }

                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();

                return (true, null);
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred while processing your request: {ex.Message}");
            }
        }
    }
}
