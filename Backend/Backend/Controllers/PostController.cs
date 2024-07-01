using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Security.Claims;

namespace Backend.Controllers
{



    [Route("post")]
    [ApiController]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly PostService _postService;

        public PostController(ApplicationDbContext context, PostService postService)
        {
            _context = context;
            _postService = postService;

        }

        // POST: api/posts
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddPost(PostDto createPostDto)
        {
            var result = await _postService.AddPostAsync(createPostDto, User);

            if (result.Success)
            {
                return CreatedAtAction("GetPost", new { id = result.Post.PostId }, result.Post);
            }

            return BadRequest(new { message = result.ErrorMessage });
        }


        // DELETE
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int id)
        {
            var result = await _postService.DeletePostAsync(id, User);

            if (result.Success)
            {
                return NoContent();
            }

            if (result.ErrorMessage.Contains("Unauthorized"))
            {
                return Unauthorized(new { message = result.ErrorMessage });
            }

            if (result.ErrorMessage.Contains("Forbidden"))
            {
                return StatusCode(403, new { message = result.ErrorMessage });
            }

            if (result.ErrorMessage.Contains("Post not found"))
            {
                return NotFound(new { message = result.ErrorMessage });
            }

            return StatusCode(500, new { message = result.ErrorMessage });
        }


        // GET: /post/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPost(int id)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);

                if (post == null)
                {
                    return NotFound();
                }

                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        // "api : /post/all"
        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllPosts()
        {
            try
            {
                // Use projection to include only the necessary properties
                var posts = await _context.Posts
                                          .Include(p => p.User)
                                          .Include(p => p.Likes)
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
                                                      l.User.Lastname
                                                  }
                                              }).ToList()
                                          })
                                  .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
        /*public async Task<IActionResult> GetAllPosts()
        {
            try
            {
                var posts = await _context.Posts.ToListAsync();
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }*/


        // POST: /post/{postId}/like
        [HttpPost("like/{postId}")]
        [Authorize]
        public async Task<IActionResult> LikePost(int postId)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userId = await _postService.GetUserIdByEmail(userEmail);

                if (userId == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                var post = await _context.Posts.FindAsync(postId);

                if (post == null)
                {
                    return NotFound(new { message = "Post not found" });
                }

                // Check if the user has already liked the post
                var existingLike = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

                if (existingLike != null)
                {
                    return BadRequest(new { message = "User has already liked this post" });
                }

                // Create new Like object
                var like = new Like
                {
                    PostId = postId,
                    UserId = userId.Value  // Assign retrieved user id from the token
                };

                _context.Likes.Add(like);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Post liked successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }


        // DELETE: /post/{postId}/unlike
        [HttpDelete("unlike/{postId}")]
        [Authorize]
        public async Task<IActionResult> UnlikePost(int postId)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userId = await _postService.GetUserIdByEmail(userEmail);

                if (userId == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                var like = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

                if (like == null)
                {
                    return BadRequest(new { message = "User has not liked this post" });
                }

                _context.Likes.Remove(like);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Post unliked successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }


    }
}
