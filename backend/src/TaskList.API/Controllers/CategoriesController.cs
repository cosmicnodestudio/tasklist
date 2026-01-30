using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskList.Application.DTOs.Categories;
using TaskList.Application.Services;

namespace TaskList.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(ICategoryService categoryService, ILogger<CategoriesController> logger)
    {
        _categoryService = categoryService;
        _logger = logger;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        try
        {
            var userId = GetUserId();
            var categories = await _categoryService.GetUserCategoriesAsync(userId);
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            return StatusCode(500, new { message = "An error occurred while retrieving categories" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        try
        {
            var userId = GetUserId();
            var category = await _categoryService.GetCategoryByIdAsync(userId, id);

            if (category == null)
                return NotFound(new { message = "Category not found" });

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category {CategoryId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the category" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        try
        {
            var userId = GetUserId();
            var category = await _categoryService.CreateCategoryAsync(userId, request);
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category");
            return StatusCode(500, new { message = "An error occurred while creating the category" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CategoryDto>> UpdateCategory(int id, [FromBody] CreateCategoryRequest request)
    {
        try
        {
            var userId = GetUserId();
            var category = await _categoryService.UpdateCategoryAsync(userId, id, request);
            return Ok(category);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Category not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating category {CategoryId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the category" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        try
        {
            var userId = GetUserId();
            await _categoryService.DeleteCategoryAsync(userId, id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Category not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting category {CategoryId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the category" });
        }
    }
}
