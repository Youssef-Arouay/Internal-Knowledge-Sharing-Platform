using Backend.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class RateFileController : ControllerBase
    {
        private readonly IRateFileService _rateFileService;
        
        public RateFileController(IRateFileService rateFileService)
        {
            _rateFileService = rateFileService;
        }

        [HttpPost("rate/{fileId}")]
        public async Task<IActionResult> RateFile(int fileId)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null)
            {
                return Unauthorized("User ID claim not found");
            }
            
            var userId = await _rateFileService.GetUserIdByEmail(userEmail);
            if (userId == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            var hasRated = await _rateFileService.HasUserRatedFileAsync(fileId, (int)userId);
            if (hasRated)
            {
                return BadRequest("You have already rated this file.");
            }

            var rate = await _rateFileService.RateFileAsync(fileId, (int)userId);
            return Ok(rate);
        }

        [HttpDelete("unrate/{fileId}")]
        public async Task<IActionResult> UnrateFile(int fileId)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null)
            {
                return Unauthorized("User ID claim not found");
            }
            var userId = await _rateFileService.GetUserIdByEmail(userEmail);
            if (userId == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            var success = await _rateFileService.UnrateFileAsync(fileId, (int)userId);
            if (!success)
            {
                return BadRequest("You have not rated this file.");
            }

            return Ok(new { message = "File unrated successfully." });
        }
    }
}
