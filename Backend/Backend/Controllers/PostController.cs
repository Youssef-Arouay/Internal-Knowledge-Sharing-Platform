using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{


    
    [Route("post")]
    [ApiController]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/posts
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddPost(PostDto createPostDto)
        {
            try
            {
                // Get user details from claims
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userId = await GetUserIdByEmail(userEmail);

                if (userId == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                // Create new Post object
                var post = new Post
                {
                    Description = createPostDto.Description,
                    Tags = createPostDto.Tags,
                    CreationDate = createPostDto.CreationDate,
                    UserId = userId.Value  // Assign retrieved user id from the token
                };

                _context.Posts.Add(post);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPost", new { id = post.PostId }, post);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to add post", error = ex.Message });
            }
        }

        private async Task<int?> GetUserIdByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return user?.Id;
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
    }
}
