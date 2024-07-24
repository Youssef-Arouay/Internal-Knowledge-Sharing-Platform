using Backend.Data;
using Backend.DTO;
using Backend.Helper;
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

        public async Task<(bool Success, Post Post, string ErrorMessage)> AddPostAsync(PostDto createPostDto, ClaimsPrincipal userClaims)
        {
            try
            {
                var userEmail = userClaims.FindFirst(ClaimTypes.Email)?.Value;
                var userId = await GetUserIdByEmail(userEmail!);

                if (userId == null)
                {
                    return (false, null, "User not found");
                }

                var post = new Post
                {
                    UserId = userId.Value,
                    Description = createPostDto.Description,
                    Tags = createPostDto.Tags,
                    CreationDate = DateTime.UtcNow
                };

                if (createPostDto.File != null)
                {
                    var fileName = $"{Guid.NewGuid()}_{createPostDto.File.FileName}";
                    var filePath = Path.Combine(Common.GetStaticContentDirectory(), "postsFiles", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await createPostDto.File.CopyToAsync(stream);
                    }

                    post.FilePath = fileName;
                }

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
                                              p.User.Lastname,
                                              ProfileImage = p.User.ProfileImage != null ? Convert.ToBase64String(p.User.ProfileImage) : null
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
                                          CommentCount = p.Comments.Count(),
                                          ContentType = GetContentType(p.FilePath!),
                                          FileName = ExtractOriginalFileName(p.FilePath!),
                                          FileContent = !string.IsNullOrEmpty(p.FilePath) ? GetFileContent(p.FilePath) : null
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
                                          ContentType = GetContentType(p.FilePath!),
                                          FileName = ExtractOriginalFileName(p.FilePath!),
                                          FileContent = !string.IsNullOrEmpty(p.FilePath) ? GetFileContent(p.FilePath) : null,
                                          p.UserId,
                                          User = new
                                          {
                                              p.User.Firstname,
                                              p.User.Lastname,
                                              ProfileImage = p.User.ProfileImage != null ? Convert.ToBase64String(p.User.ProfileImage) : null,

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

        // method to get file content
        private static string GetFileContent(string filePath)
        {
            try
            {
                var fullPath = Path.Combine(Common.GetStaticContentDirectory(), "postsFiles", filePath);
                return Convert.ToBase64String(File.ReadAllBytes(fullPath));
            }
            catch (FileNotFoundException)
            {
                return "file indisponible";
            }
            catch (Exception)
            {
                return "file indisponible";
            }
        }


        //To get a post's fileContent type 
        private static string GetContentType(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return null;
            }

            var extension = Path.GetExtension(filePath)?.ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".pdf" => "application/pdf",
                _ => "application/octet-stream"
            };
        }

        private static string ExtractOriginalFileName(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return null;
            }

            var parts = fileName.Split('_', 2);
            return parts.Length > 1 ? parts[1] : fileName;
        }





    }
}
