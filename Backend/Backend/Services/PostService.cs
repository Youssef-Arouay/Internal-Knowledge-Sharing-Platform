using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Backend.Services.IServices;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Services
{
    public class PostService : IPostService
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
                    UserId = userId.Value,
                    Description = createPostDto.Description,
                    Tags = createPostDto.Tags,
                    CreationDate = createPostDto.CreationDate
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


        // Delete post with deleting Like, comments...
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
                // Delete Like associated with the post
                var likesToDelete = await _context.Likes.Where(l => l.PostId == postId).ToListAsync();
                _context.Likes.RemoveRange(likesToDelete);

                // Delete comments associated with the post
                var commentsToDelete = await _context.Comments.Where(c => c.PostId == postId).ToListAsync();
                _context.Comments.RemoveRange(commentsToDelete);

                // Delete saved posts associated with the post
                var savedPostsToDelete = await _context.SavedPosts.Where(ps => ps.PostId == postId).ToListAsync();
                _context.SavedPosts.RemoveRange(savedPostsToDelete);

                // Now delete the post itself
                _context.Posts.Remove(post);

                await _context.SaveChangesAsync();

                return (true, null);
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred while processing your request: {ex.Message}");
            }
        }


        //GetAllPosts
        public async Task<List<object>> GetAllPostsAsync()
        {
            var posts = await _context.Posts
                                      .Include(p => p.User)
                                      .Include(p => p.Likes)
                                      .Include(p => p.Comments)
                                      .Select(p => new
                                      {
                                          p.PostId,
                                          p.Description,
                                          p.Tags,
                                          p.CreationDate,
                                          p.UserId,
                                          User = new
                                          {
                                              p.User.Firstname,
                                              p.User.Lastname
                                          },
                                          Likes = p.Likes.Select(l => new
                                          {
                                              l.LikeId,
                                              l.UserId,
                                              User = new
                                              {
                                                  l.User.Firstname,
                                                  l.User.Lastname,
                                              }
                                          }).ToList(),
                                          CommentCount = p.Comments.Count()
                                      })
                                      .ToListAsync();

            return posts.Cast<object>().ToList();
        }


        //Get a user's post
        public async Task<List<object>> GetMyPostsAsync(int userId)
        {
            var posts = await _context.Posts
                                       .Where(f => f.UserId == userId)
                                      .Include(p => p.User)
                                      .Include(p => p.Likes)
                                      .Include(p => p.Comments)
                                      .Select(p => new
                                      {
                                          p.PostId,
                                          p.Description,
                                          p.Tags,
                                          p.CreationDate,
                                          p.UserId,
                                          User = new
                                          {
                                              p.User.Firstname,
                                              p.User.Lastname
                                          },
                                          Likes = p.Likes.Select(l => new
                                          {
                                              l.LikeId,
                                              l.UserId,
                                              User = new
                                              {
                                                  l.User.Firstname,
                                                  l.User.Lastname,
                                              }
                                          }).ToList(),
                                          CommentCount = p.Comments.Count()
                                      })
                                      .ToListAsync();

            return posts.Cast<object>().ToList();
        }

        // get nomber comments of a post
        public async Task<int> GetCommentCountAsync(int postId)
        {
            return await _context.Comments
                .CountAsync(c => c.PostId == postId);
        }


    }
}
