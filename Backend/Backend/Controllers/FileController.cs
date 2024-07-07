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
        private readonly IFileService _fileService;
        private readonly ApplicationDbContext _context;

        public FileController(IFileService fileService, ApplicationDbContext context)
        {
            _fileService = fileService;
            _context = context;
        }

        /*[HttpPost]
        [Route("uploadfile")]
        public async Task<IActionResult> UploadFile(IFormFile formFile, [FromForm] FileDto fileDto)
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

                var result = await _fileService.UploadFile(formFile, fileDto, user.Id);
                return Ok(result);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Argument null exception: {ex.Message}");
            }
            catch (FormatException ex)
            {
                return BadRequest($"Format exception: {ex.Message}");
            }
            catch (Exception ex)
            {
                if (ex.Message == "A file with this EntityName already exists.")
                {
                    return Conflict(ex.Message); // Return HTTP 409 Conflict
                }
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while uploading the file: {ex.Message}");
            }
        }*/

        [HttpPost]
        [Route("uploadfile")]
        public async Task<IActionResult> UploadFile(IFormFile formFile, [FromForm] FileDto fileDto)
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

                var result = await _fileService.UploadFile(formFile, fileDto, user.Id);
                return Ok(new { FileName = result }); // Return a JSON object with the file name
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(new { error = ex.Message }); // Return a JSON error
            }
            catch (FormatException ex)
            {
                return BadRequest(new { error = ex.Message }); // Return a JSON error
            }
            catch (Exception ex)
            {
                if (ex.Message == "A file with this EntityName already exists.")
                {
                    return Conflict(new { error = ex.Message }); // Return a JSON error
                }
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message }); // Return a JSON error
            }
        }


        [HttpGet]
        [Route("downloadfile")]
        public async Task<IActionResult> DownloadFile(string entityName)
        {
            try
            {
                var result = await _fileService.DownloadFile(entityName);
                return File(result.Item1, result.Item2, result.Item3);
            }
            catch (FileNotFoundException ex)
            {
                return NotFound($"File not found: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while downloading the file: {ex.Message}");
            }
        }




    }
}
