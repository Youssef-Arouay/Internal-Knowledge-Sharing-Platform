using Backend.DTO;

namespace Backend.Services.IServices
{
    public interface IUserService
    {
        Task<UserDto> GetUserDetailsAsync(string email);
        Task<bool> UpdateUserAsync(string email, UpdateUserDto updateUserDto);


    }
}
