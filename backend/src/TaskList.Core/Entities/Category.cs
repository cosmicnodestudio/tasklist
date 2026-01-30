namespace TaskList.Core.Entities;

public class Category
{
    public Category()
    {
        CreatedAt = DateTime.UtcNow;
    }

    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = "#3B82F6";
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
