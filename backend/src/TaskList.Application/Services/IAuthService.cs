using TaskList.Application.DTOs.Auth;

namespace TaskList.Application.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}
