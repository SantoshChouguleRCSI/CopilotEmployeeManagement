namespace EmployeeManagement.Domain.Entities;

public sealed class Employee
{
    public Guid Id { get; private set; }
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Department { get; private set; } = string.Empty;
    public string JobTitle { get; private set; } = string.Empty;
    public decimal Salary { get; private set; }
    public DateOnly DateOfJoining { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Required by EF Core / serializers
    private Employee() { }

    public static Employee Create(
        string firstName,
        string lastName,
        string email,
        string department,
        string jobTitle,
        decimal salary,
        DateOnly dateOfJoining)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(department);
        ArgumentException.ThrowIfNullOrWhiteSpace(jobTitle);

        if (salary < 0)
            throw new ArgumentOutOfRangeException(nameof(salary), "Salary cannot be negative.");

        var now = DateTime.UtcNow;

        return new Employee
        {
            Id = Guid.NewGuid(),
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Department = department,
            JobTitle = jobTitle,
            Salary = salary,
            DateOfJoining = dateOfJoining,
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    public void UpdateDetails(
        string firstName,
        string lastName,
        string email,
        string department,
        string jobTitle)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(department);
        ArgumentException.ThrowIfNullOrWhiteSpace(jobTitle);

        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Department = department;
        JobTitle = jobTitle;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateSalary(decimal salary)
    {
        if (salary < 0)
            throw new ArgumentOutOfRangeException(nameof(salary), "Salary cannot be negative.");

        Salary = salary;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }
}
