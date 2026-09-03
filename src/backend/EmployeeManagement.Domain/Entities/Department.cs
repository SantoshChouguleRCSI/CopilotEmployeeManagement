namespace EmployeeManagement.Domain.Entities;

public sealed class Department
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Required by EF Core / serializers
    private Department() { }

    public static Department Create(string name, string description)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        name = name.Trim();

        var now = DateTime.UtcNow;

        return new Department
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description ?? string.Empty,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    public void Update(string name, string description)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        Name = name.Trim();
        Description = description ?? string.Empty;
        UpdatedAt = DateTime.UtcNow;
    }
}
