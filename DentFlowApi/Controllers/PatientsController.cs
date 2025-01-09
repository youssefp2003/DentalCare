using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DentFlowApi.Data;
using DentFlowApi.Models;

namespace DentFlowApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PatientsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/patients
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
    {
        return await _context.Patients.ToListAsync();
    }

    // GET: api/patients/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Patient>> GetPatient(string id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null)
        {
            return NotFound();
        }
        return patient;
    }

    // POST: api/patients
    [HttpPost]
    public async Task<ActionResult<Patient>> CreatePatient(Patient patient)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Generate a new ID if not provided
        if (string.IsNullOrEmpty(patient.Id))
        {
            patient.Id = Guid.NewGuid().ToString();
        }

        try
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetPatient),
                new { id = patient.Id },
                patient
            );
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to create patient", error = ex.Message });
        }
    }

    // PUT: api/patients/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(string id, Patient patient)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != patient.Id)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        try
        {
            _context.Entry(patient).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PatientExists(id))
            {
                return NotFound(new { message = "Patient not found" });
            }
            throw;
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to update patient", error = ex.Message });
        }

        return NoContent();
    }

    // DELETE: api/patients/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(string id)
    {
        try
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound(new { message = "Patient not found" });
            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to delete patient", error = ex.Message });
        }
    }

    private bool PatientExists(string id)
    {
        return _context.Patients.Any(e => e.Id == id);
    }
}
