using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Services
{
    public class PostService
    {
        private readonly ApplicationDbContext _context;

        public PostService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        //get UserId from Email
        public async Task<int?> GetUserIdByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return user?.Id;
        }

        // Add Post Logic
        public async Task<(bool Success, Post Post, string ErrorMessage)> AddPostAsync(PostDto createPostDto, ClaimsPrincipal userClaims)
        {
            try
            {
                var userEmail = userClaims.FindFirst(ClaimTypes.Email)?.Value;
                var userId = await GetUserIdByEmail(userEmail);

                if (userId == null)
                {
                    return (false, null, "User not found");
                }

                var post = new Post
                {
                    Description = createPostDto.Description,
                    Tags = createPostDto.Tags,
                    CreationDate = createPostDto.CreationDate,
                    UserId = userId.Value
                };

                _context.Posts.Add(post);
                await _context.SaveChangesAsync();

                return (true, post, null);
            }
            catch (Exception ex)
            {
                return (false, null, $"Failed to add post: {ex.Message}");
            }
        }


        public async Task<(bool Success, string ErrorMessage)> DeletePostAsync(int postId, ClaimsPrincipal userClaims)
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

                var post = await _context.Posts.FindAsync(postId);

                if (post == null)
                {
                    return (false, "Post not found.");
                }

                if (post.UserId != user.Id)
                {
                    return (false, "Forbidden: User does not own the post.");
                }

                _context.Posts.Remove(post);
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
