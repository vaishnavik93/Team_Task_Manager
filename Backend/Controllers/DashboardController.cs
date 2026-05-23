using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int userId = userIdStr != null ? int.Parse(userIdStr) : 0;

        IQueryable<Models.TaskItem> query = _context.Tasks;

        if (role != "Admin")
        {
            query = query.Where(t => t.AssignedToId == userId);
        }

        var totalTasks = await query.CountAsync();
        var pendingTasks = await query.CountAsync(t => t.Status == "Pending");
        var completedTasks = await query.CountAsync(t => t.Status == "Completed");
        var inProgressTasks = await query.CountAsync(t => t.Status == "In Progress");
        var overdueTasks = await query.CountAsync(t => t.DueDate < DateTime.UtcNow && t.Status != "Completed");

        return Ok(new
        {
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            overdueTasks
        });
    }
}
