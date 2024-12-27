import { useState } from 'react';
import { Patient } from '../types';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import PatientModal from './PatientModal';

export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePatient = (patient: Patient) => {
    let updatedPatients;
    if (editingPatient) {
      updatedPatients = patients.map(p => p.id === patient.id ? patient : p);
    } else {
      updatedPatients = [...patients, { ...patient, id: crypto.randomUUID() }];
    }
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      const updatedPatients = patients.filter(p => p.id !== id);
      setPatients(updatedPatients);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Patients</h2>
        <button 
          onClick={() => {
            setEditingPatient(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Patient
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 text-gray-600">Name</th>
              <th className="text-left p-4 text-gray-600">Email</th>
              <th className="text-left p-4 text-gray-600">Phone</th>
              <th className="text-left p-4 text-gray-600">Date of Birth</th>
              <th className="text-right p-4 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  {patient.firstName} {patient.lastName}
                </td>
                <td className="p-4">{patient.email}</td>
                <td className="p-4">{patient.phone}</td>
                <td className="p-4">{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEditingPatient(patient);
                      setIsModalOpen(true);
                    }}
                    className="text-gray-600 hover:text-blue-600 p-1"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="text-gray-600 hover:text-red-600 p-1 ml-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatient(null);
        }}
        onSave={handleSavePatient}
        patient={editingPatient}
      />
    </div>
  );
}