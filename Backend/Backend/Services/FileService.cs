using Backend.Data;
using Backend.Models;
using Backend.Helper;
using Backend.Services.IServices;
using Microsoft.AspNetCore.StaticFiles;
using Backend.DTO;
using Microsoft.Extensions.FileProviders;

namespace Backend.Services
{
    public class FileService : IFileService
    {
        private readonly ApplicationDbContext _context;

        public FileService(ApplicationDbContext context)
        {
            _context = context;
        }


        // Upload File and save details to database
        /*public async Task<string> UploadFile(IFormFile _IFormFile, FileDto fileDto)
        {
            string FileName = "";
            try
            {
                FileInfo _FileInfo = new FileInfo(_IFormFile.FileName);
                FileName = _IFormFile.FileName + "_" + DateTime.Now.Ticks.ToString() + _FileInfo.Extension;
                var _GetFilePath = Common.GetFilePath(FileName);
                using (var _FileStream = new FileStream(_GetFilePath, FileMode.Create))
                {
                    await _IFormFile.CopyToAsync(_FileStream);
                }

                // Save file details to database
                var fileEntity = new FileEntity
                {
                    FileName = FileName,
                    Description = fileDto.Description,
                    Tags = fileDto.Tags,
                    Version = fileDto.Version
                };

                _context.FileEntities.Add(fileEntity);
                await _context.SaveChangesAsync();

                return FileName;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // Download File
        public async Task<(byte[], string, string)> DownloadFile(string FileName)
        {
            try
            {
                var _GetFilePath = Common.GetFilePath(FileName);
                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(_GetFilePath, out var _ContentType))
                {
                    _ContentType = "application/octet-stream";
                }
                var _ReadAllBytesAsync = await File.ReadAllBytesAsync(_GetFilePath);
                return (_ReadAllBytesAsync, _ContentType, Path.GetFileName(_GetFilePath));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }*/

        // Upload File and save details to database
        public async Task<string> UploadFile(IFormFile file, FileDto fileDto, int userId)
        {
            string fileName = "";
            try
            {
                var fileInfo = new FileInfo(file.FileName);
                fileName = fileDto.FileName + "_" + DateTime.Now.Ticks.ToString() + fileInfo.Extension;
                var filePath = Common.GetFilePath(fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Save file details to database
                var fileEntity = new FileEntity
                {
                    FileName = fileName,
                    Description = fileDto.Description,
                    Tags = fileDto.Tags,
                    Version = fileDto.Version,
                    UserId = userId,
                    CreationDate = DateTime.UtcNow
                };

                _context.FileEntities.Add(fileEntity);
                await _context.SaveChangesAsync();

                return fileName;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to upload file", ex);
            }
        }

        // Download File
        public async Task<(byte[], string, string)> DownloadFile(string fileName)
        {
            try
            {
                var filePath = Common.GetFilePath(fileName);

                if (!File.Exists(filePath))
                {
                    throw new FileNotFoundException("File not found");
                }

                var fileBytes = await File.ReadAllBytesAsync(filePath);
                var provider = new FileExtensionContentTypeProvider();

                if (!provider.TryGetContentType(filePath, out var contentType))
                {
                    contentType = "application/octet-stream";
                }

                return (fileBytes, contentType, Path.GetFileName(filePath));
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to download file", ex);
            }
        }
    }
}
