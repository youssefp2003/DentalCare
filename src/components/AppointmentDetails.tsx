import { X } from 'lucide-react';
import { AppointmentDTO } from '../types';

interface AppointmentDetailsProps {
  appointment: AppointmentDTO;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export default function AppointmentDetails({
  appointment,
  isOpen,
  onClose,
  onDelete,
}: AppointmentDetailsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Appointment Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
            <p className="text-gray-700">
              {appointment.patientFirstName} {appointment.patientLastName}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Date & Time</h3>
            <p className="text-gray-700">
              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
            </p>
            <p className="text-gray-600 mt-1">Duration: {appointment.duration} minutes</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Appointment Type</h3>
            <p className="text-gray-700">{appointment.type}</p>
          </div>

          {appointment.notes && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{appointment.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={() => onDelete(appointment.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
