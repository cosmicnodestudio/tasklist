namespace TaskList.Core.Entities;

public class User
{
    public User()
    {
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    public ICollection<Category> Categories { get; set; } = new List<Category>();
}
