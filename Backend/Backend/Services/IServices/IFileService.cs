using Backend.DTO;

namespace Backend.Services.IServices
{
    public interface IFileService
    {
/*        Task<string> UploadFile(IFormFile _IFormFile, FileDto fileDto);  */
        Task<string> UploadFile(IFormFile formFile, FileDto fileDto, int userId);
        Task<(byte[], string, string)> DownloadFile(string fileName);
        Task<List<FileDtoResp>> GetAllFiles(int userId);
        Task<List<FileDtoResp>> GetMyFiles(int userId);
        Task<bool> DeleteFileAsync(int fileId, int userId); 

    }

}
