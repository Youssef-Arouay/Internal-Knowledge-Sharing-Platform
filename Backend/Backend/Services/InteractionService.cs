using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Backend.Services.IServices;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Services
{
    public class InteractionService : IInteractionService
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

        // get nomber comments of a post
        public async Task<int> GetCommentCountAsync(int postId)
        {
            return await _context.Comments
                .CountAsync(c => c.PostId == postId);
        }

        /// delete a comment
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

        // Save a post
        public async Task<bool> SavePostAsync(int userId, int postId)
        {
            try
            {
                var savedPost = new SavedPost { UserId = userId, PostId = postId, SaveDate = DateTime.UtcNow };

                _context.SavedPosts.Add(savedPost);
                await _context.SaveChangesAsync();
                
                return true;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                Console.WriteLine($"Error saving post: {ex.Message}");
                return false;
            }
        }


        // Unsave a post
        public async Task<bool> UnsavePostAsync(int userId, int postId)
        {
            try
            {
                var savedPost = await _context.SavedPosts.FirstOrDefaultAsync(sp => sp.UserId == userId && sp.PostId == postId);
                if (savedPost != null)
                {
                    _context.SavedPosts.Remove(savedPost);
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                Console.WriteLine($"Error unsaving post: {ex.Message}");
                return false;
            }
        }


        // Get saved posts for a user
        public async Task<List<object>> GetSavedPostsAsync(int userId)
        {
            try
            {
                var savedPosts = await _context.SavedPosts
                    .Include(sp => sp.Post)
                    .ThenInclude(p => p.User) // Include the user of the post
                    .Include(sp => sp.Post.Likes) // Include likes for the post
                    .Include(sp => sp.Post.Comments) // Include comments for the post
                    .Where(sp => sp.UserId == userId)
                    .Select(sp => new
                    {
                        sp.Post.PostId,
                        sp.Post.Description,
                        sp.Post.Tags,
                        sp.Post.CreationDate,
                        User = new
                        {
                            sp.Post.User.Firstname,
                            sp.Post.User.Lastname
                        },
                        Likes = sp.Post.Likes.Select(l => new
                        {
                            l.LikeId,
                            l.UserId,
                            User = new
                            {
                                l.User.Firstname,
                                l.User.Lastname,
                            }
                        }).ToList(),
                        CommentCount = sp.Post.Comments.Count()
                    })
                    .ToListAsync();

                return savedPosts.Cast<object>().ToList();
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                Console.WriteLine($"Error retrieving saved posts: {ex.Message}");
                return new List<object>();
            }
        }

        /*public async Task<List<savedPostDto>> GetSavedPostsAsync(int userId)
        {
            try
            {

                return await _context.SavedPosts
                    .Include(sp => sp.Post)
                    .Where(sp => sp.UserId == userId)
                    .Select(sp => new savedPostDto
                    {
                        Id = sp.PostId,
                        SaveDate = sp.SaveDate,
                        PostId = sp.PostId,
                        UserId = sp.UserId,
                        Posts = new List<PostDto>
                        {
                    new PostDto
                    {
                        PostId = sp.Post.PostId,
                        Description = sp.Post.Description,
                        Tags = sp.Post.Tags,
                        CreationDate = sp.Post.CreationDate,
                    }
                        }
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                Console.WriteLine($"Error retrieving saved posts: {ex.Message}");
                return new List<savedPostDto>();
            }
        }*/

    }
}
