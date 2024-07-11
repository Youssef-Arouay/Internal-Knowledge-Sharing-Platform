using Backend.Data;
using Backend.Models;
using Backend.Helper;
using Backend.Services.IServices;
using Microsoft.AspNetCore.StaticFiles;
using Backend.DTO;
using Microsoft.EntityFrameworkCore;


namespace Backend.Services
{
    public class FileService : IFileService
    {
        private readonly ApplicationDbContext _context;

        public FileService(ApplicationDbContext context)
        {
            _context = context;
        }

        // UPLOAD FILE METHODE
        public async Task<string> UploadFile(IFormFile formFile, FileDto fileDto, int userId)
        {
            try
            {
                // Check if the EntityName is unique
                var existingFile = await _context.FileEntities.FirstOrDefaultAsync(f => f.EntityName == fileDto.EntityName);
                if (existingFile != null)
                {
                    throw new Exception("A file with this EntityName already exists.");
                }

                var fileExtension = Path.GetExtension(formFile.FileName);
               
                /* string fileName = fileDto.EntityName + fileExtension; */
                
                string fileName = formFile.FileName ;
                
                var filePath = Common.GetFilePath(fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await formFile.CopyToAsync(fileStream);
                }

                var fileEntity = new FileEntity
                {
                    FileName = fileName,
                    EntityName = fileDto.EntityName,
                    Description = fileDto.Description,
                    Tags = fileDto.Tags,
                    Version = fileDto.Version,
                    Rates = 0,
                    Downloads = 0,
                    UploadDate = DateTime.UtcNow,
                    UserId = userId
                };

                _context.FileEntities.Add(fileEntity);
                await _context.SaveChangesAsync();

                return fileName;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        // DOWNLOAD FILE 
        public async Task<(byte[], string, string)> DownloadFile(string entityName)
        {
            try
            {
                // Fetch the FileEntity from the database using the provided entity name
                var fileEntity = await _context.FileEntities.FirstOrDefaultAsync(f => f.EntityName == entityName);
                if (fileEntity == null)
                {
                    throw new FileNotFoundException("File not found in the database.");
                }

                // Increment the download count
                fileEntity.Downloads++;
                await _context.SaveChangesAsync(); // Save changes to update the download count

                var fileName = fileEntity.FileName;
                var filePath = Common.GetFilePath(fileName);
                var provider = new FileExtensionContentTypeProvider();

                if (!provider.TryGetContentType(filePath, out var contentType))
                {
                    contentType = "application/octet-stream";
                }

                var fileBytes = await File.ReadAllBytesAsync(filePath);

                return (fileBytes, contentType, Path.GetFileName(filePath));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //GET ALL FILES
        /* public async Task<List<FileDtoResp>> GetAllFiles(int userId)
         {
             try
             {
                 var files = await _context.FileEntities
                     .Where(f => f.UserId == userId)
                     .Select(f => new FileDtoResp
                     {
                         Id = f.Id,
                         EntityName = f.EntityName,
                         Description = f.Description,
                         Tags = f.Tags,
                         Version = f.Version,
                         UploadDate = f.UploadDate,
                         Downloads = f.Downloads,
                         Rates = f.Rates,
                         FirstName = f.User.Firstname, // Include FirstName
                         LastName = f.User.Lastname    // Include LastName
                     })
                     .ToListAsync();
                 return files;
             }
             catch (Exception ex)
             {
                 throw new Exception("An error occurred while retrieving files.", ex);
             }
         }*/
        public async Task<List<FileDtoResp>> GetAllFiles(int userId)
        {
            try
            {
                var files = await _context.FileEntities
/*                    .Where(f => f.UserId == userId)*/                    
                        .Select(f => new FileDtoResp
                    {
                        Id = f.Id,
                        EntityName = f.EntityName,
                        Description = f.Description,
                        Tags = f.Tags,
                        Version = f.Version,
                        UploadDate = f.UploadDate,
                        Downloads = f.Downloads,
                        Rates = f.Rates,
                        FirstName = f.User.Firstname, 
                        LastName = f.User.Lastname,   
                        RatedByUsers = f.RateFiles.Select(fr => new UserResp
                        {
                            Id = fr.UserId,
                            Username = fr.User.Firstname + " " + fr.User.Lastname,
                        }).ToList()
                    })
                    .ToListAsync();

                return files;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving files.", ex);
            }
        }

        // GET THE FILES OF A USER
        public async Task<List<FileDtoResp>> GetMyFiles(int userId)
        {
            try
            {
                var files = await _context.FileEntities
                        .Where(f => f.UserId == userId)
                        .Select(f => new FileDtoResp
                        {
                            Id = f.Id,
                            EntityName = f.EntityName,
                            Description = f.Description,
                            Tags = f.Tags,
                            Version = f.Version,
                            UploadDate = f.UploadDate,
                            Downloads = f.Downloads,
                            Rates = f.Rates,
                            FirstName = f.User.Firstname,
                            LastName = f.User.Lastname,
                            RatedByUsers = f.RateFiles.Select(fr => new UserResp
                            {
                                Id = fr.UserId,
                                Username = fr.User.Firstname + " " + fr.User.Lastname,
                            }).ToList()
                        })
                    .ToListAsync();

                return files;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving files.", ex);
            }
        }


    }
}
