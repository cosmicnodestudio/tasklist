using TaskList.Application.DTOs.Auth;
using TaskList.Core.Entities;
using TaskList.Core.Interfaces;

namespace TaskList.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public AuthService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _userRepository.ExistsAsync(request.Email, request.Username))
        {
            throw new InvalidOperationException("User with this email or username already exists");
        }

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdUser = await _userRepository.AddAsync(user);
        var token = _tokenService.GenerateToken(createdUser);

        return new AuthResponse
        {
            Id = createdUser.Id,
            Username = createdUser.Username,
            Email = createdUser.Email,
            Token = token
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        var token = _tokenService.GenerateToken(user);

        return new AuthResponse
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Token = token
        };
    }
}
