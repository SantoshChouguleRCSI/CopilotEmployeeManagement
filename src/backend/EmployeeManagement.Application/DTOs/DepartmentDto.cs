namespace EmployeeManagement.Application.DTOs;

public sealed record DepartmentDto(
    Guid Id,
    string Name,
    string Description,
    DateTime CreatedAt,
    DateTime UpdatedAt);
