namespace DentFlowApi.DTOs;

public class AppointmentDTO
{
    public string Id { get; set; } = string.Empty;
    public string PatientId { get; set; } = string.Empty;
    public string PatientFirstName { get; set; } = string.Empty;
    public string PatientLastName { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public int Duration { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
