using System.ComponentModel.DataAnnotations;

namespace DentFlowApi.Models;

public class Patient
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Phone]
    public string PhoneNumber { get; set; } = string.Empty;
    
    public DateTime DateOfBirth { get; set; }
    
    public string MedicalHistory { get; set; } = string.Empty;

    // Navigation property
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
