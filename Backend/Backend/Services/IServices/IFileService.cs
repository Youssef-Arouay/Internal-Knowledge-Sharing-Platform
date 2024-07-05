using Backend.DTO;

namespace Backend.Services.IServices
{
    public interface IFileService
    {
        /* Task<string> UploadFile(IFormFile _IFormFile, FileDto fileDto);
         Task<(byte[], string, string)> DownloadFile(string FileName);*/

        Task<string> UploadFile(IFormFile file, FileDto fileDto, int userId);
        Task<(byte[], string, string)> DownloadFile(string fileName);
    }
}
