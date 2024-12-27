import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Patient, Appointment } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    upcomingTreatments: 0,
  });

  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem('patients') || '[]') as Patient[];
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]') as Appointment[];
    
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today).length;
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingTreatments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate > new Date() && aptDate <= nextWeek;
    }).length;

    setStats({
      todayAppointments,
      totalPatients: patients.length,
      upcomingTreatments,
    });
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h2>
        <p className="text-gray-600 mt-1">
          Here's your {user?.role === 'practitioner' ? 'practice' : 'clinic'} overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</p>
        </div>

        {user?.role === 'practitioner' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Upcoming Treatments</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.upcomingTreatments}</p>
        </div>
      </div>
    </div>
  );
}