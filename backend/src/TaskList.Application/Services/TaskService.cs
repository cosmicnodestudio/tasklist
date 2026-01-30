using TaskList.Application.DTOs.Tasks;
using TaskList.Core.Entities;
using TaskList.Core.Interfaces;

namespace TaskList.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetUserTasksAsync(int userId, string? status = null, string? priority = null, int? categoryId = null)
    {
        TaskList.Core.Entities.TaskStatus? taskStatus = status != null ? Enum.Parse<TaskList.Core.Entities.TaskStatus>(status) : null;
        TaskList.Core.Entities.TaskPriority? taskPriority = priority != null ? Enum.Parse<TaskList.Core.Entities.TaskPriority>(priority) : null;

        var tasks = await _taskRepository.GetUserTasksAsync(userId, taskStatus, taskPriority, categoryId);

        return tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status.ToString(),
            Priority = t.Priority.ToString(),
            DueDate = t.DueDate,
            CategoryId = t.CategoryId,
            CategoryName = t.Category?.Name,
            CategoryColor = t.Category?.Color,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt,
            CompletedAt = t.CompletedAt
        });
    }

    public async System.Threading.Tasks.Task<TaskDto?> GetTaskByIdAsync(int userId, int taskId)
    {
        var task = await _taskRepository.GetUserTaskByIdAsync(userId, taskId);

        if (task == null)
            return null;

        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status.ToString(),
            Priority = task.Priority.ToString(),
            DueDate = task.DueDate,
            CategoryId = task.CategoryId,
            CategoryName = task.Category?.Name,
            CategoryColor = task.Category?.Color,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            CompletedAt = task.CompletedAt
        };
    }

    public async System.Threading.Tasks.Task<TaskDto> CreateTaskAsync(int userId, CreateTaskRequest request)
    {
        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = Enum.Parse<TaskList.Core.Entities.TaskPriority>(request.Priority),
            DueDate = request.DueDate,
            CategoryId = request.CategoryId,
            UserId = userId,
            Status = TaskList.Core.Entities.TaskStatus.Todo,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdTask = await _taskRepository.AddAsync(task);

        return new TaskDto
        {
            Id = createdTask.Id,
            Title = createdTask.Title,
            Description = createdTask.Description,
            Status = createdTask.Status.ToString(),
            Priority = createdTask.Priority.ToString(),
            DueDate = createdTask.DueDate,
            CategoryId = createdTask.CategoryId,
            CreatedAt = createdTask.CreatedAt,
            UpdatedAt = createdTask.UpdatedAt
        };
    }

    public async System.Threading.Tasks.Task<TaskDto> UpdateTaskAsync(int userId, int taskId, UpdateTaskRequest request)
    {
        var task = await _taskRepository.GetUserTaskByIdAsync(userId, taskId);

        if (task == null)
            throw new KeyNotFoundException("Task not found");

        task.Title = request.Title;
        task.Description = request.Description;
        task.Status = Enum.Parse<TaskList.Core.Entities.TaskStatus>(request.Status);
        task.Priority = Enum.Parse<TaskList.Core.Entities.TaskPriority>(request.Priority);
        task.DueDate = request.DueDate;
        task.CategoryId = request.CategoryId;
        task.UpdatedAt = DateTime.UtcNow;

        if (task.Status == TaskList.Core.Entities.TaskStatus.Done && task.CompletedAt == null)
        {
            task.CompletedAt = DateTime.UtcNow;
        }
        else if (task.Status != TaskList.Core.Entities.TaskStatus.Done)
        {
            task.CompletedAt = null;
        }

        await _taskRepository.UpdateAsync(task);

        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status.ToString(),
            Priority = task.Priority.ToString(),
            DueDate = task.DueDate,
            CategoryId = task.CategoryId,
            CategoryName = task.Category?.Name,
            CategoryColor = task.Category?.Color,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            CompletedAt = task.CompletedAt
        };
    }

    public async System.Threading.Tasks.Task DeleteTaskAsync(int userId, int taskId)
    {
        var task = await _taskRepository.GetUserTaskByIdAsync(userId, taskId);

        if (task == null)
            throw new KeyNotFoundException("Task not found");

        await _taskRepository.DeleteAsync(task);
    }
}
