import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PatientList from './components/PatientList';
import PatientSearchView from './components/PatientSearchView';
import Calendar from './components/Calendar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="ml-64">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/appointments" element={<Calendar />} />
                      <Route
                        path="/patients"
                        element={
                          <ProtectedRoute allowedRoles={['practitioner']}>
                            <PatientList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/patient-search"
                        element={
                          <ProtectedRoute allowedRoles={['assistant']}>
                            <PatientSearchView />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;