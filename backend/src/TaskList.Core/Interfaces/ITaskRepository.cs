using TaskList.Core.Entities;

namespace TaskList.Core.Interfaces;

public interface ITaskRepository : IRepository<TaskItem>
{
    System.Threading.Tasks.Task<IEnumerable<TaskItem>> GetUserTasksAsync(int userId, TaskList.Core.Entities.TaskStatus? status = null, TaskList.Core.Entities.TaskPriority? priority = null, int? categoryId = null);
    System.Threading.Tasks.Task<TaskItem?> GetUserTaskByIdAsync(int userId, int taskId);
}
