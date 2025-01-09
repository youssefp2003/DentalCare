import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Patient, AppointmentDTO } from '../types';
import { API_BASE_URL } from '../config';
import AppointmentDetails from './AppointmentDetails';

export default function Dashboard() {
  const { token } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }
    Promise.all([fetchPatients(), fetchAppointments()]).finally(() => {
      setIsLoading(false);
    });
  }, [token]);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.status}`);
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
            Promise.all([fetchPatients(), fetchAppointments()]).finally(() => {
              setIsLoading(false);
            });
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(appointment => appointment.date === today);

  // Get upcoming treatments
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingTreatments = appointments.filter(appointment => {
    const aptDate = new Date(appointment.date);
    return aptDate > new Date() && aptDate <= nextWeek;
  });

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
          <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
        </div>

        {/* Today's Appointments Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold text-green-600">{todayAppointments.length}</p>
        </div>

        {/* Upcoming Treatments Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Upcoming Treatments</h3>
          <p className="text-3xl font-bold text-orange-600">{upcomingTreatments.length}</p>
        </div>

        {/* Total Appointments Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Appointments</h3>
          <p className="text-3xl font-bold text-purple-600">{appointments.length}</p>
        </div>
      </div>

      {/* Today's Appointments List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Today's Appointments</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {todayAppointments.length === 0 ? (
            <p className="p-4 text-gray-500">No appointments scheduled for today</p>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <tr 
                      key={appointment.id}
                      onClick={() => setSelectedAppointment(appointment)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientFirstName} {appointment.patientLastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.duration} min</div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onDelete={async (id: string) => {
            try {
              const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (response.ok) {
                setSelectedAppointment(null);
                // Refresh appointments after deletion
                fetchAppointments();
              }
            } catch (error) {
              console.error('Error deleting appointment:', error);
            }
          }}
        />
      )}
    </div>
  );
}