import { useEffect, useState } from 'react';
import { Appointment, Patient } from '../types';
import { X } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  appointment: Appointment | null;
  selectedDateTime: Date | null;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSave,
  appointment,
  selectedDateTime,
}: AppointmentModalProps) {
  const [patients] = useState<Patient[]>(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState<Omit<Appointment, 'id'>>({
    patientId: '',
    date: '',
    time: '',
    duration: 30,
    type: '',
    notes: '',
  });

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    } else if (selectedDateTime) {
      setFormData({
        ...formData,
        date: selectedDateTime.toISOString().split('T')[0],
        time: selectedDateTime.toTimeString().slice(0, 5),
      });
    } else {
      setFormData({
        patientId: '',
        date: '',
        time: '',
        duration: 30,
        type: '',
        notes: '',
      });
    }
  }, [appointment, selectedDateTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: appointment?.id || '',
      ...formData,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md z-50">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <select
              required
              className="w-full p-2 border rounded-lg"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              required
              className="w-full p-2 border rounded-lg"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Select type</option>
              <option value="Checkup">Checkup</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Filling">Filling</option>
              <option value="Root Canal">Root Canal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full p-2 border rounded-lg"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}