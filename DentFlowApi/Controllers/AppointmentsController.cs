using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DentFlowApi.Data;
using DentFlowApi.Models;
using DentFlowApi.DTOs;

namespace DentFlowApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AppointmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/appointments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAppointments()
    {
        var appointments = await _context.Appointments
            .Include(a => a.Patient)
            .Select(a => new AppointmentDTO
            {
                Id = a.Id,
                PatientId = a.PatientId,
                PatientFirstName = a.Patient != null ? a.Patient.FirstName : string.Empty,
                PatientLastName = a.Patient != null ? a.Patient.LastName : string.Empty,
                Date = a.Date.ToString("yyyy-MM-dd"),
                Time = a.Time,
                Duration = a.Duration,
                Type = a.Type,
                Notes = a.Notes ?? string.Empty
            })
            .ToListAsync();

        return appointments;
    }

    // GET: api/appointments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<AppointmentDTO>> GetAppointment(string id)
    {
        var appointment = await _context.Appointments
            .Include(a => a.Patient)
            .Where(a => a.Id == id)
            .Select(a => new AppointmentDTO
            {
                Id = a.Id,
                PatientId = a.PatientId,
                PatientFirstName = a.Patient != null ? a.Patient.FirstName : string.Empty,
                PatientLastName = a.Patient != null ? a.Patient.LastName : string.Empty,
                Date = a.Date.ToString("yyyy-MM-dd"),
                Time = a.Time,
                Duration = a.Duration,
                Type = a.Type,
                Notes = a.Notes ?? string.Empty
            })
            .FirstOrDefaultAsync();

        if (appointment == null)
        {
            return NotFound();
        }

        return appointment;
    }

    // GET: api/appointments/patient/5
    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetPatientAppointments(string patientId)
    {
        var appointments = await _context.Appointments
            .Where(a => a.PatientId == patientId)
            .Include(a => a.Patient)
            .Select(a => new AppointmentDTO
            {
                Id = a.Id,
                PatientId = a.PatientId,
                PatientFirstName = a.Patient != null ? a.Patient.FirstName : string.Empty,
                PatientLastName = a.Patient != null ? a.Patient.LastName : string.Empty,
                Date = a.Date.ToString("yyyy-MM-dd"),
                Time = a.Time,
                Duration = a.Duration,
                Type = a.Type,
                Notes = a.Notes ?? string.Empty
            })
            .ToListAsync();

        return appointments;
    }

    // PUT: api/appointments/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAppointment(string id, Appointment appointment)
    {
        if (id != appointment.Id)
        {
            return BadRequest();
        }

        _context.Entry(appointment).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AppointmentExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/appointments
    [HttpPost]
    public async Task<ActionResult<AppointmentDTO>> PostAppointment(Appointment appointment)
    {
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        var appointmentDto = await GetAppointment(appointment.Id);
        return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointmentDto.Value);
    }

    // DELETE: api/appointments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointment(string id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
        {
            return NotFound();
        }

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AppointmentExists(string id)
    {
        return _context.Appointments.Any(e => e.Id == id);
    }
}
