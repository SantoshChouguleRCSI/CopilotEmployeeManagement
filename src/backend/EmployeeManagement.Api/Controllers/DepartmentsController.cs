using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Departments;
using EmployeeManagement.Application.Departments.Requests;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Api.Controllers;

[ApiController]
[Route("api/departments")]
[Produces("application/json")]
public sealed class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _service;

    public DepartmentsController(IDepartmentService service) => _service = service;

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<DepartmentDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var departments = await _service.GetAllAsync(cancellationToken);
        return Ok(departments);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<DepartmentDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var department = await _service.GetByIdAsync(id, cancellationToken);
        return department is null ? NotFound() : Ok(department);
    }

    [HttpPost]
    [ProducesResponseType<DepartmentDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateDepartmentRequest request, CancellationToken cancellationToken)
    {
        var department = await _service.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = department.Id }, department);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<DepartmentDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, UpdateDepartmentRequest request, CancellationToken cancellationToken)
    {
        var department = await _service.UpdateAsync(id, request, cancellationToken);
        return Ok(department);
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
