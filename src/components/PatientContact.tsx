import { useEffect, useState } from 'react';
import { X, Phone, Mail } from 'lucide-react';
import { Patient } from '../types';

interface PatientContactProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
}

export default function PatientContact({ isOpen, onClose, appointmentId }: PatientContactProps) {
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (appointmentId) {
      const patients = JSON.parse(localStorage.getItem('patients') || '[]') as Patient[];
      const found = patients.find(p => p.id === appointmentId);
      setPatient(found || null);
    }
  }, [appointmentId]);

  if (!isOpen || !patient) return null;

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Patient Contact</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900">
            {patient.firstName} {patient.lastName}
          </h4>
          <p className="text-sm text-gray-500">
            Born: {new Date(patient.dateOfBirth).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="h-4 w-4" />
          <a href={`tel:${patient.phoneNumber}`} className="hover:text-blue-600">
            {patient.phoneNumber}
          </a>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="h-4 w-4" />
          <a href={`mailto:${patient.email}`} className="hover:text-blue-600">
            {patient.email}
          </a>
        </div>

        {patient.medicalHistory && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-1">Medical History</h4>
            <p className="text-sm text-gray-600">{patient.medicalHistory}</p>
          </div>
        )}
      </div>
    </div>
  );
}