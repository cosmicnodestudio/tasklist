using Microsoft.EntityFrameworkCore;
using TaskList.Core.Entities;
using TaskList.Core.Interfaces;
using TaskList.Infrastructure.Data;

namespace TaskList.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<bool> ExistsAsync(string email, string username)
    {
        return await _dbSet.AnyAsync(u => u.Email == email || u.Username == username);
    }
}
