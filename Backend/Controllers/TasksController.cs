using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        IQueryable<TaskItem> query = _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedTo);

        if (role != "Admin")
        {
            query = query.Where(t => t.AssignedToId == userId);
        }

        var tasks = await query.Select(t => new TaskResponseDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            DueDate = t.DueDate,
            CreatedAt = t.CreatedAt,
            ProjectId = t.ProjectId,
            AssignedToId = t.AssignedToId,
            AssignedToName = t.AssignedTo != null ? t.AssignedTo.Name : null,
            ProjectName = t.Project != null ? t.Project.Name : null
        }).ToListAsync();

        return Ok(tasks);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateTask(TaskCreateDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            ProjectId = dto.ProjectId,
            DueDate = dto.DueDate,
            AssignedToId = dto.AssignedToId
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return Ok(task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTaskStatus(int id, TaskUpdateDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        var role = User.FindFirstValue(ClaimTypes.Role);
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (role != "Admin" && task.AssignedToId != userId)
        {
            return Forbid();
        }

        task.Status = dto.Status;
        await _context.SaveChangesAsync();

        return Ok(task);
    }
}
