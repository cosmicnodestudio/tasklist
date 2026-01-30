using TaskList.Core.Entities;

namespace TaskList.Application.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
