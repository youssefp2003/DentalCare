import { useState, useEffect } from 'react';
import { Patient } from '../types';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import PatientModal from './PatientModal';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function PatientList() {
  const { user } = useAuth();
  const isDoctor = user?.role === 'practitioner';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/patients`);

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePatient = async (patient: Patient) => {
    try {
      setError(null);
      const method = patient.id ? 'PUT' : 'POST';
      const url = patient.id ? `${API_BASE_URL}/patients/${patient.id}` : `${API_BASE_URL}/patients`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...patient,
          id: patient.id || crypto.randomUUID(),
          dateOfBirth: new Date(patient.dateOfBirth).toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${patient.id ? 'update' : 'create'} patient`);
      }

      await fetchPatients();
      setIsModalOpen(false);
      setEditingPatient(null);
    } catch (err) {
      console.error('Error saving patient:', err);
      setError(err instanceof Error ? err.message : 'Failed to save patient');
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        setError(null);
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete patient');
        }

        await fetchPatients();
      } catch (err) {
        console.error('Error deleting patient:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete patient');
      }
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {isDoctor && (
          <button
            onClick={() => {
              setEditingPatient(null);
              setIsModalOpen(true);
            }}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Patient
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
              {isDoctor && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.email}</div>
                  <div className="text-sm text-gray-500">{patient.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </div>
                </td>
                {isDoctor && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingPatient(patient);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && isDoctor && (
        <PatientModal
          isOpen={isModalOpen}
          patient={editingPatient}
          onSave={handleSavePatient}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPatient(null);
          }}
        />
      )}
    </div>
  );
}