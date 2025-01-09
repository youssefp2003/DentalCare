import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Appointment, AppointmentDTO } from '../types';
import AppointmentModal from './AppointmentModal';
import AppointmentDetails from './AppointmentDetails';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent extends AppointmentDTO {
  start: Date;
  end: Date;
  title: string;
}

export default function Calendar() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/appointments`);

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAppointment = async (appointment: Appointment) => {
    try {
      const url = editingAppointment
        ? `${API_BASE_URL}/appointments/${appointment.id}`
        : `${API_BASE_URL}/appointments`;
      
      const response = await fetch(url, {
        method: editingAppointment ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: appointment.id,
          patientId: appointment.patientId,
          date: appointment.date,
          time: appointment.time,
          duration: appointment.duration,
          type: appointment.type,
          notes: appointment.notes || ''
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save appointment: ${response.status} ${response.statusText} ${errorText}`);
      }

      await fetchAppointments();
      setIsModalOpen(false);
      setEditingAppointment(null);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to save appointment');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete appointment: ${response.status} ${response.statusText} ${errorText}`);
        }

        await fetchAppointments();
        setSelectedAppointment(null);
      } catch (err) {
        console.error('Error deleting appointment:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete appointment');
      }
    }
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (user?.role === 'assistant') {
      setSelectedSlot(start);
      setIsModalOpen(true);
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    const appointment = appointments.find(a => a.id === event.id);
    if (appointment) {
      setSelectedAppointment(appointment);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading appointments...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const events: CalendarEvent[] = appointments.map(appointment => ({
    ...appointment,
    start: new Date(`${appointment.date}T${appointment.time}`),
    end: new Date(new Date(`${appointment.date}T${appointment.time}`).getTime() + appointment.duration * 60000),
    title: `${appointment.patientFirstName} ${appointment.patientLastName} - ${appointment.type}`
  }));

  return (
    <div className="h-screen p-4">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 'calc(100vh - 2rem)' }}
      />

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppointment(null);
          setSelectedSlot(null);
        }}
        onSave={handleSaveAppointment}
        appointment={editingAppointment}
        selectedDateTime={selectedSlot}
      />

      {selectedAppointment && (
        <AppointmentDetails
          isOpen={!!selectedAppointment}
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  );
}