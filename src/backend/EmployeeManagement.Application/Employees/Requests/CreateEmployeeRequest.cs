using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Application.Employees.Requests;

public sealed record CreateEmployeeRequest(
    [Required, MaxLength(100)] string FirstName,
    [Required, MaxLength(100)] string LastName,
    [Required, EmailAddress, MaxLength(200)] string Email,
    [Required, MaxLength(100)] string Department,
    [Required, MaxLength(100)] string JobTitle,
    [Range(0, double.MaxValue, ErrorMessage = "Salary must be non-negative.")] decimal Salary,
    DateOnly DateOfJoining);
