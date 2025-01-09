using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DentFlowApi.Models;

public class Appointment
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string PatientId { get; set; } = string.Empty;
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    public string Time { get; set; } = string.Empty;
    
    public int Duration { get; set; } // in minutes
    
    public string Type { get; set; } = string.Empty;
    
    public string Notes { get; set; } = string.Empty;

    // Navigation property
    [ForeignKey("PatientId")]
    public Patient? Patient { get; set; }
}
