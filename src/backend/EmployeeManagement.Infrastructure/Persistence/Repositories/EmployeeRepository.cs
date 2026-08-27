using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Persistence.Repositories;

internal sealed class EmployeeRepository : IEmployeeRepository
{
    private readonly EmployeeDbContext _context;

    public EmployeeRepository(EmployeeDbContext context) => _context = context;

    public async Task<Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Employees.FindAsync([id], cancellationToken);

    public async Task<IReadOnlyList<Employee>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Employees.ToListAsync(cancellationToken);

    public async Task AddAsync(Employee employee, CancellationToken cancellationToken = default)
    {
        await _context.Employees.AddAsync(employee, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Employee employee, CancellationToken cancellationToken = default)
    {
        _context.Employees.Update(employee);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var employee = await _context.Employees.FindAsync([id], cancellationToken);
        if (employee is not null)
        {
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
