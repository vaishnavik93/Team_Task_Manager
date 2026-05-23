namespace Backend.DTOs;

public class TaskCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ProjectId { get; set; }
    public DateTime DueDate { get; set; }
    public int? AssignedToId { get; set; }
}

public class TaskUpdateDto
{
    public string Status { get; set; } = string.Empty;
}

public class TaskResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ProjectId { get; set; }
    public int? AssignedToId { get; set; }
    public string? AssignedToName { get; set; }
    public string? ProjectName { get; set; }
}
