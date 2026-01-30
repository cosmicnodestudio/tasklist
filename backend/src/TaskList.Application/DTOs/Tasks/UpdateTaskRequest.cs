namespace TaskList.Application.DTOs.Tasks;

public class UpdateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = "Todo";
    public string Priority { get; set; } = "Medium";
    public DateTime? DueDate { get; set; }
    public int? CategoryId { get; set; }
}
