using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Application.Departments.Requests;

public sealed record UpdateDepartmentRequest(
    [Required, MaxLength(100)] string Name,
    [MaxLength(500)] string Description = "");
