using Backend.Data;
using Backend.Models;
using Backend.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class RateFileService : IRateFileService
    {
        private readonly ApplicationDbContext _context;

        public RateFileService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int?> GetUserIdByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return user?.Id;
        }

        public async Task<bool> HasUserRatedFileAsync(int fileId, int userId)
        {
            return await _context.RateFiles.AnyAsync(rf => rf.FileId == fileId && rf.UserId == userId);
        }

        public async Task<object> RateFileAsync(int fileId, int userId)
        {
            try
            {
                var rateFile = new RateFile
                {
                    FileId = fileId,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.RateFiles.Add(rateFile);
                await _context.SaveChangesAsync();

                var file = await _context.FileEntities.FindAsync(fileId);
                file.Rates += 1;
                await _context.SaveChangesAsync();

                return new { rateFile.RateId, rateFile.FileId, rateFile.UserId, rateFile.CreatedAt };
            }
            catch (Exception ex)
            {
                throw; // Re-throw the exception to propagate it further
            }
        }

        public async Task<bool> UnrateFileAsync(int fileId, int userId)
        {
            try
            {
                var rateFile = await _context.RateFiles
                    .FirstOrDefaultAsync(rf => rf.FileId == fileId && rf.UserId == userId);

                if (rateFile == null)
                {
                    return false;
                }

                _context.RateFiles.Remove(rateFile);
                await _context.SaveChangesAsync();

                var file = await _context.FileEntities.FindAsync(fileId);
                file.Rates -= 1;
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw; // Re-throw the exception to propagate it further
            }
        }
    }
}
