using TaskList.Application.DTOs.Categories;
using TaskList.Core.Entities;
using TaskList.Core.Interfaces;

namespace TaskList.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetUserCategoriesAsync(int userId)
    {
        var categories = await _categoryRepository.GetUserCategoriesAsync(userId);

        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Color = c.Color,
            CreatedAt = c.CreatedAt,
            TaskCount = c.Tasks.Count
        });
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int userId, int categoryId)
    {
        var category = await _categoryRepository.GetUserCategoryByIdAsync(userId, categoryId);

        if (category == null)
            return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Color = category.Color,
            CreatedAt = category.CreatedAt,
            TaskCount = category.Tasks.Count
        };
    }

    public async Task<CategoryDto> CreateCategoryAsync(int userId, CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Color = request.Color,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var createdCategory = await _categoryRepository.AddAsync(category);

        return new CategoryDto
        {
            Id = createdCategory.Id,
            Name = createdCategory.Name,
            Color = createdCategory.Color,
            CreatedAt = createdCategory.CreatedAt,
            TaskCount = 0
        };
    }

    public async Task<CategoryDto> UpdateCategoryAsync(int userId, int categoryId, CreateCategoryRequest request)
    {
        var category = await _categoryRepository.GetUserCategoryByIdAsync(userId, categoryId);

        if (category == null)
            throw new KeyNotFoundException("Category not found");

        category.Name = request.Name;
        category.Color = request.Color;

        await _categoryRepository.UpdateAsync(category);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Color = category.Color,
            CreatedAt = category.CreatedAt,
            TaskCount = category.Tasks.Count
        };
    }

    public async Task DeleteCategoryAsync(int userId, int categoryId)
    {
        var category = await _categoryRepository.GetUserCategoryByIdAsync(userId, categoryId);

        if (category == null)
            throw new KeyNotFoundException("Category not found");

        await _categoryRepository.DeleteAsync(category);
    }
}
