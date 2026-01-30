using TaskList.Core.Entities;

namespace TaskList.Core.Interfaces;

public interface ICategoryRepository : IRepository<Category>
{
    Task<IEnumerable<Category>> GetUserCategoriesAsync(int userId);
    Task<Category?> GetUserCategoryByIdAsync(int userId, int categoryId);
}
