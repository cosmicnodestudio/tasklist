using Microsoft.EntityFrameworkCore;
using TaskList.Core.Entities;
using TaskList.Core.Interfaces;
using TaskList.Infrastructure.Data;

namespace TaskList.Infrastructure.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Category>> GetUserCategoriesAsync(int userId)
    {
        return await _dbSet
            .Include(c => c.Tasks)
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Category?> GetUserCategoryByIdAsync(int userId, int categoryId)
    {
        return await _dbSet
            .Include(c => c.Tasks)
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId);
    }
}
