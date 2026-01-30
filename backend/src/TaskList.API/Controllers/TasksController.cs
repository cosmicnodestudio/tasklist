using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskList.Application.DTOs.Tasks;
using TaskList.Application.Services;

namespace TaskList.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly ILogger<TasksController> _logger;

    public TasksController(ITaskService taskService, ILogger<TasksController> logger)
    {
        _taskService = taskService;
        _logger = logger;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks(
        [FromQuery] string? status = null,
        [FromQuery] string? priority = null,
        [FromQuery] int? categoryId = null)
    {
        try
        {
            var userId = GetUserId();
            var tasks = await _taskService.GetUserTasksAsync(userId, status, priority, categoryId);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tasks");
            return StatusCode(500, new { message = "An error occurred while retrieving tasks" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        try
        {
            var userId = GetUserId();
            var task = await _taskService.GetTaskByIdAsync(userId, id);

            if (task == null)
                return NotFound(new { message = "Task not found" });

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving task {TaskId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the task" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask([FromBody] CreateTaskRequest request)
    {
        try
        {
            var userId = GetUserId();
            var task = await _taskService.CreateTaskAsync(userId, request);
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task");
            return StatusCode(500, new { message = "An error occurred while creating the task" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskDto>> UpdateTask(int id, [FromBody] UpdateTaskRequest request)
    {
        try
        {
            var userId = GetUserId();
            var task = await _taskService.UpdateTaskAsync(userId, id, request);
            return Ok(task);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Task not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task {TaskId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the task" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
        try
        {
            var userId = GetUserId();
            await _taskService.DeleteTaskAsync(userId, id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Task not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task {TaskId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the task" });
        }
    }
}
