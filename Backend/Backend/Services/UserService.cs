using Backend.Data;
using Backend.DTO;
using Backend.Services.IServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto> GetUserDetailsAsync(string email)
    {
        var user = await _context.Users
            .Include(u => u.Posts)  
            .Include(u => u.Likes)  
            .Include(u => u.Files)
            .Include(u => u.Comments)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            return null; 
        }

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Firstname = user.Firstname,
            Lastname = user.Lastname,
            phoneNumber = user.phoneNumber,

            Username = user.Username,
            PostsCount = user.Posts.Count(),
            InteractionsCount = user.Likes.Count() + user.Comments.Count() + user.RateFiles.Count(),
            FilesCount = user.Files.Count()
        };
    }
}
