using TaskList.Application.DTOs.Tasks;

namespace TaskList.Application.Services;

public interface ITaskService
{
    System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetUserTasksAsync(int userId, string? status = null, string? priority = null, int? categoryId = null);
    System.Threading.Tasks.Task<TaskDto?> GetTaskByIdAsync(int userId, int taskId);
    System.Threading.Tasks.Task<TaskDto> CreateTaskAsync(int userId, CreateTaskRequest request);
    System.Threading.Tasks.Task<TaskDto> UpdateTaskAsync(int userId, int taskId, UpdateTaskRequest request);
    System.Threading.Tasks.Task DeleteTaskAsync(int userId, int taskId);
}
