using TaskList.Core.Entities;

namespace TaskList.Core.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
    Task<bool> ExistsAsync(string email, string username);
}
