using TaskList.Application.DTOs.Categories;

namespace TaskList.Application.Services;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetUserCategoriesAsync(int userId);
    Task<CategoryDto?> GetCategoryByIdAsync(int userId, int categoryId);
    Task<CategoryDto> CreateCategoryAsync(int userId, CreateCategoryRequest request);
    Task<CategoryDto> UpdateCategoryAsync(int userId, int categoryId, CreateCategoryRequest request);
    Task DeleteCategoryAsync(int userId, int categoryId);
}
