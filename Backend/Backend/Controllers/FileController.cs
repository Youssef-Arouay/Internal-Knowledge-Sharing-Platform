using Backend.Data;
using Backend.DTO;
using Backend.Services;
using Backend.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("[controller]/")]
    [ApiController]
    [Authorize]
    public class FileController : ControllerBase
    {
        private readonly IFileService _iFileService;
        private readonly InteractionService _interactionService;

        public FileController(IFileService iFileService, InteractionService interactionService)
        {
            _iFileService = iFileService;
            _interactionService = interactionService;

        }

        /*public FileController(IFileService iFileService)
        {
            _iFileService = iFileService;
        }*/

        /*[HttpPost]
        [Route("uploadfile")]
        public async Task<IActionResult> UploadFile(IFormFile _IFormFile, [FromForm] FileDto fileDto)
        {
            var result = await _iFileService.UploadFile(_IFormFile, fileDto);
            return Ok(result);
        }


        [HttpGet]
        [Route("downloadfile")]
        public async Task<IActionResult> DownloadFile(string FileName)
        {
            var result = await _iFileService.DownloadFile(FileName);
            return File(result.Item1, result.Item2, result.Item3);
        }*/
        [HttpPost]
        [Route("uploadfile")]
        public async Task<IActionResult> UploadFile([FromForm] FileDto request)
        {
            try
            {
                // Get UserId from claims (bearer token)
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var userId = await _interactionService.GetUserIdByEmail(userEmail);

                if (userId == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                // Ensure only allowed fields are used
                var fileDto = new FileDto
                {
                    FileName = request.FileName,
                    Description = request.Description,
                    Tags = request.Tags,
                    Version = request.Version
                };

                var fileName = await _iFileService.UploadFile(request.File, fileDto, userId);

                return Ok(new { FileName = fileName }); // Return FileName if needed
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to upload file", error = ex.Message });
            }
        }



        [HttpGet("downloadfile")]
        public async Task<IActionResult> DownloadFile(string fileName)
        {
            try
            {
                var result = await _iFileService.DownloadFile(fileName);
                return File(result.Item1, result.Item2, result.Item3);
            }
            catch (FileNotFoundException)
            {
                return NotFound("File not found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to download file", error = ex.Message });
            }
        }
    }
}
