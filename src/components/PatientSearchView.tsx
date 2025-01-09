import { useState } from 'react';
import { Patient } from '../types';
import { Search, Phone, Mail } from 'lucide-react';

export default function PatientSearchView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState<Patient[]>(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : [];
  });

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName} ${patient.email} ${patient.phoneNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Directory</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <h3 className="font-semibold text-lg text-gray-900">
              {patient.firstName} {patient.lastName}
            </h3>
            
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-500">
                Born: {new Date(patient.dateOfBirth).toLocaleDateString()}
              </p>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <a href={`tel:${patient.phoneNumber}`} className="text-sm hover:text-blue-600">
                  {patient.phoneNumber}
                </a>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${patient.email}`} className="text-sm hover:text-blue-600">
                  {patient.email}
                </a>
              </div>
            </div>

            {patient.medicalHistory && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Medical History</h4>
                <p className="text-sm text-gray-600">{patient.medicalHistory}</p>
              </div>
            )}
          </div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No patients found matching your search
          </div>
        )}
      </div>
    </div>
  );
}