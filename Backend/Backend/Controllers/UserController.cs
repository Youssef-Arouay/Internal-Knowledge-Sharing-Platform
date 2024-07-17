using Backend.Data;
using Backend.DTO;
using Backend.Models;
using Backend.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("user")]
    [ApiController]
    [Authorize]
    public class UserController : Controller
    {

        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;

        public UserController(ApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }


        [HttpGet(nameof(GetUserDetails))]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetUserDetails()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest("Email claim not found in token.");
                }

                var userDetails = await _userService.GetUserDetailsAsync(email);

                if (userDetails == null)
                {
                    return NotFound("User not found.");
                }

                return Ok(userDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut(nameof(UpdateUser))]
        [Authorize]
        public async Task<IActionResult> UpdateUser([FromForm] UpdateUserDto updateUserDto)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest("Email claim not found in token.");
                }

                var result = await _userService.UpdateUserAsync(email, updateUserDto);

                if (!result)
                {
                    return NotFound("User not found.");
                }

                return Ok(new { message = "User updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
