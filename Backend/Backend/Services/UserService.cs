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

    // get user details
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
            PhoneNumber = user.PhoneNumber,
            BirthDate = user.BirthDate,
            Username = user.Username,
            ProfileImage = user.ProfileImage != null ? Convert.ToBase64String(user.ProfileImage) : null,


            PostsCount = user.Posts.Count(),
            InteractionsCount = user.Likes.Count() + user.Comments.Count() + user.RateFiles.Count(),
            FilesCount = user.Files.Count()
        };
    }

    // Update user profile
    public async Task<bool> UpdateUserAsync(string email, UpdateUserDto updateUserDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            return false;
        }

        user.Firstname = updateUserDto.Firstname ?? user.Firstname;
        user.Lastname = updateUserDto.Lastname ?? user.Lastname;
        user.Username = updateUserDto.Username ?? user.Username;
        user.BirthDate = updateUserDto.BirthDate ?? user.BirthDate;
        user.PhoneNumber = updateUserDto.PhoneNumber ?? user.PhoneNumber;

        if (updateUserDto.ProfileImage != null)
        {
            using var memoryStream = new MemoryStream();
            await updateUserDto.ProfileImage.CopyToAsync(memoryStream);
            user.ProfileImage = memoryStream.ToArray();
        }

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return true;
    }
}
