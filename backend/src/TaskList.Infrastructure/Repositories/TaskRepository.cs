using Microsoft.EntityFrameworkCore;
using TaskList.Core.Entities;
using TaskList.Core.Interfaces;
using TaskList.Infrastructure.Data;

namespace TaskList.Infrastructure.Repositories;

public class TaskRepository : Repository<TaskItem>, ITaskRepository
{
    public TaskRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskItem>> GetUserTasksAsync(int userId, TaskList.Core.Entities.TaskStatus? status = null, TaskList.Core.Entities.TaskPriority? priority = null, int? categoryId = null)
    {
        var query = _dbSet
            .Include(t => t.Category)
            .Where(t => t.UserId == userId);

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        if (categoryId.HasValue)
            query = query.Where(t => t.CategoryId == categoryId.Value);

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async System.Threading.Tasks.Task<TaskItem?> GetUserTaskByIdAsync(int userId, int taskId)
    {
        return await _dbSet
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
    }
}
