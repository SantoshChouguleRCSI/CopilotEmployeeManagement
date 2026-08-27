using EmployeeManagement.Application.Departments;
using EmployeeManagement.Application.Employees;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeManagement.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IDepartmentService, DepartmentService>();
        return services;
    }
}
