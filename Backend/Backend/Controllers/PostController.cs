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
                var posts = await _context.Posts.ToListAsync();
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
    }
}
