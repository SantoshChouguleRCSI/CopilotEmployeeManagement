namespace EmployeeManagement.Application.DTOs;

public sealed record EmployeeDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string Department,
    string JobTitle,
    decimal Salary,
    DateOnly DateOfJoining,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);
