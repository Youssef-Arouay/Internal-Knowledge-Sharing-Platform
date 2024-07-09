using Backend.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Backend.Data;
using Backend.Services.IServices;


namespace Backend.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        //public static User user = new User(); Should noy be static user entity


        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;

        public AuthController(IConfiguration configuration, ApplicationDbContext context, IAuthService authService)
        {
            _configuration = configuration;
            _context = context;
            _authService = authService;
        }


        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto request)
        {
            try
            {
                if (!_authService.IsValidEmail(request.Email))
                {
                    return BadRequest("Invalid email format.");
                }

                if (await _authService.EmailExistsAsync(request.Email))
                {
                    return BadRequest("Email already exists.");
                }

                if (!_authService.IsValidPassword(request.Password))
                {
                    return BadRequest("Password must be at least 8 characters long.");
                }

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var user = new User
                {
                    Firstname = request.Firstname,
                    Lastname = request.Lastname,
                    Email = request.Email,
                    PasswordHash = passwordHash
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto request)
        {
            try
            {
                var user = await _authService.GetUserByEmailAsync(request.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return BadRequest("Wrong Email or Password!");
                }
                string token = CreateToken(user);
                var  response = new
                {
                    Token = token,
                    User = user
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error occurred during login");
            }
        }


        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, "User"),

            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("Jwt:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds 
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}
