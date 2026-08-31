using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Employees;
using EmployeeManagement.Application.Employees.Requests;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Api.Controllers;

[ApiController]
[Route("api/employees")]
[Produces("application/json")]
public sealed class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _service;

    public EmployeesController(IEmployeeService service) => _service = service;

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<EmployeeDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] string? search, CancellationToken cancellationToken)
    {
        var employees = await _service.GetAllAsync(search, cancellationToken);
        return Ok(employees);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<EmployeeDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var employee = await _service.GetByIdAsync(id, cancellationToken);
        return employee is null ? NotFound() : Ok(employee);
    }

    [HttpPost]
    [ProducesResponseType<EmployeeDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var employee = await _service.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<EmployeeDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, UpdateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var employee = await _service.UpdateAsync(id, request, cancellationToken);
        return Ok(employee);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _service.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
