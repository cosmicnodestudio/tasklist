namespace TaskList.Core.Entities;

public class TaskItem
{
    public TaskItem()
    {
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskStatus Status { get; set; } = TaskStatus.Todo;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public DateTime? DueDate { get; set; }
    public int UserId { get; set; }
    public int? CategoryId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Category? Category { get; set; }
}

public enum TaskStatus
{
    Todo,
    InProgress,
    Done
}

public enum TaskPriority
{
    Low,
    Medium,
    High,
    Urgent
}
