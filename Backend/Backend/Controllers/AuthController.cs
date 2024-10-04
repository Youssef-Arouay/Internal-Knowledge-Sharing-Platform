using Backend.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Services.IServices;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;


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
                    Username = request.Firstname + request.Lastname,
                    Email = request.Email,
                    CreationDate = DateTime.Now,
                    PhoneNumber = "",
                    ProfileImage = [],
                    PasswordHash = passwordHash
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var registerRespDto = new RegisterRespDto
                {
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Email = user.Email
                };

                return Ok(registerRespDto);
            }
            catch (DbUpdateException dbEx)
            {
                // Log and return more detailed error information
                return StatusCode(500, $"Database update error: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
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
                string token = _authService.CreateToken(user);
                var response = new
                {
                    Token = token,
                    User = user
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error occurred during login" + ex);
            }
        }


        // Login with google account( only if it exists)
        [HttpPost("loginWithGoogle")]
        public async Task<IActionResult> LoginGoogle([FromBody] string credential)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string> { this._configuration.GetSection("GoogleClient:Id").Value! }
                };

                Console.WriteLine("settings", settings);

                var payLoad = await GoogleJsonWebSignature.ValidateAsync(credential, settings);

                Console.WriteLine("payLoad", payLoad);

                var user = await _authService.GetUserByEmailAsync(payLoad.Email);

                if (user != null)
                {
                    string token = _authService.CreateToken(user);
                    var response = new
                    {
                        Token = token,
                        User = user
                    };
                    return Ok(response);
                }
                else
                {
                    return BadRequest("User not found. You must Sign up with the same email first !");
                }
            }
            catch (Google.Apis.Auth.InvalidJwtException ex)
            {
                // Handle invalid JWT exception
                Console.WriteLine($"Invalid JWT: {ex.Message}");
                return BadRequest("Invalid token");
            }
            catch (Exception ex)
            {
                // Handle all other exceptions
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

    }

}