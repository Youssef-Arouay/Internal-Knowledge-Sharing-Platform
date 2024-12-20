﻿using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Backend.Services;
using Backend.Services.IServices;
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
        private readonly IPostService _postService;

        public PostController(ApplicationDbContext context, IPostService postService)
        {
            _context = context;
            _postService = postService;

        }

        // POST: api/posts
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddPost([FromForm] PostDto createPostDto)
        {
            var result = await _postService.AddPostAsync(createPostDto, User);

            if (result.Success)
            {
                return CreatedAtAction("GetPost", new { id = result.Post.PostId }, result.Post);
            }

            return BadRequest(new { message = result.ErrorMessage });
        }



        // DELETE
        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int id)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
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
                var posts = await _postService.GetAllPostsAsync();
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        // Return User's posts
        [HttpGet("myposts")]
        [Authorize]
        public async Task<IActionResult> GetMyPosts()
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return BadRequest("User email is missing or invalid.");
                }

                // Fetch the user ID based on the email
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null)
                {
                    return NotFound("User not found.");
                }
                var posts = await _postService.GetMyPostsAsync(user.Id);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }


    }
}
