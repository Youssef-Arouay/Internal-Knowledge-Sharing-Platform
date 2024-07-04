using Backend.DTO;
using Backend.Services;
using Backend.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _iFileService;

        public FileController(IFileService iFileService)
        {
            _iFileService = iFileService;
        }

        [HttpPost]
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
        }
    }
}
