using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("post/")]
    [ApiController]
    public class InteractionController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly InteractionService _interactionService;

        public InteractionController(ApplicationDbContext context, InteractionService interactionService)
        {
            _context = context;
            _interactionService = interactionService;

        }


        ////////////////
        /// LIKE AND UNLIKE
        /////////////



        [HttpPost("like/{postId}")]
        [Authorize]
        public async Task<IActionResult> LikePost(int postId)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userId = await _interactionService.GetUserIdByEmail(userEmail);

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
                    UserId = userId.Value,  // Assign retrieved user id from the token
                    CreatedAt = DateTime.UtcNow,
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
                var userId = await _interactionService.GetUserIdByEmail(userEmail);

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



        //
        //      COMMENT
        //

        // add a comment 
        [HttpPost("/post/comment/add")]
        [Authorize]
        public async Task<IActionResult> AddComment(CommentDto commentDto)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userId = await _interactionService.GetUserIdByEmail(userEmail);

                if (userId == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                var comment = new Comment
                {
                    PostId = commentDto.PostId,
                    UserId = userId.Value,
                    Content = commentDto.Content,
                    CreationDate = commentDto.CreationDate != default ? commentDto.CreationDate : DateTime.Now
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Comment added successfully" });
            }
            catch (Exception ex)
            {
                // Log the exception for troubleshooting purposes
                Console.WriteLine($"Error adding comment: {ex.Message}");
                return StatusCode(500, new { message = "Failed to add comment", error = ex.Message });
            }
        }



        // DELETE a comment 
        [HttpDelete("comment/delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                var result = await _interactionService.DeleteCommentAsync(id, User);

                if (result.Success)
                {
                    return Ok(new { message = "Comment deleted successfully" });
                }

                if (result.ErrorMessage.Contains("Unauthorized"))
                {
                    return Unauthorized(new { message = result.ErrorMessage });
                }

                if (result.ErrorMessage.Contains("Forbidden"))
                {
                    return StatusCode(403, new { message = result.ErrorMessage });
                }

                if (result.ErrorMessage.Contains("Comment not found"))
                {
                    return NotFound(new { message = result.ErrorMessage });
                }

                return StatusCode(500, new { message = result.ErrorMessage });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        // GET all commetns of a specific post
        [HttpGet("{postId}/comments")]
        [Authorize]
        public async Task<IActionResult> GetPostComments(int postId)
        {
            try
            {
                // Retrieve user ID from claims
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userId = await _interactionService.GetUserIdByEmail(userEmail);

                if (userId == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                // Retrieve comments for the specified postId along with user details
                var comments = await _context.Comments
                                            .Include(c => c.User)
                                            .Where(c => c.PostId == postId)
                                            .Select(c => new
                                            {
                                                c.CommentId,
                                                c.PostId,
                                                c.UserId,
                                                c.Content,
                                                User = new
                                                {
                                                    c.User.Firstname,
                                                    c.User.Lastname
                                                }
                                            })
                                            .ToListAsync();
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        // GET Nbre of comments on a post
        [HttpGet("{postId}/comment/count")]
        [Authorize]
        public async Task<IActionResult> GetCommentCount(int postId)
        {
            try
            {
                var commentCount = await _interactionService.GetCommentCountAsync(postId);

                return Ok(new { postId, commentCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }



    }


}
