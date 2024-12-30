import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Appointment} from '../types';
import AppointmentModal from './AppointmentModal';
import PatientContact from './PatientContact';
import { useAuth } from '../contexts/AuthContext';
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

export default function Calendar() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showPatientContact, setShowPatientContact] = useState(false);

  const handleSaveAppointment = (appointment: Appointment) => {
    let updatedAppointments;
    if (editingAppointment) {
      updatedAppointments = appointments.map(a => a.id === appointment.id ? appointment : a);
    } else {
      updatedAppointments = [...appointments, { ...appointment, id: crypto.randomUUID() }];
    }
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setIsModalOpen(false);
    setEditingAppointment(null);
    setSelectedSlot(null);
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (user?.role === 'assistant') {
      setSelectedSlot(start);
      setEditingAppointment(null);
      setIsModalOpen(true);
    }
  };

  const handleSelectEvent = (event: any) => {
    const appointment = appointments.find(a => a.id === event.id);
    if (appointment) {
      if (user?.role === 'assistant') {
        setEditingAppointment(appointment);
        setIsModalOpen(true);
      }
      setSelectedAppointment(appointment);
      setShowPatientContact(true);
    }
  };

  const events = appointments.map(apt => ({
    id: apt.id,
    title: `Patient Appointment: ${apt.type}`,
    start: new Date(apt.date + 'T' + apt.time),
    end: new Date(new Date(apt.date + 'T' + apt.time).getTime() + apt.duration * 60000),
  }));

  return (
    <div className="h-[calc(100vh-2rem)] p-4 relative">
      <BigCalendar
        localizer={localizer}
        events={events}
        views={['month', 'week', 'day']}
        defaultView="week"
        step={30}
        timeslots={2}
        selectable={user?.role === 'assistant'}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />

      {user?.role === 'assistant' && (
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
      )}

      <PatientContact
        isOpen={showPatientContact}
        onClose={() => {
          setShowPatientContact(false);
          setSelectedAppointment(null);
        }}
        appointmentId={selectedAppointment?.patientId || ''}
      />
    </div>
  );
}