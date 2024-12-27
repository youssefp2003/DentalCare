import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, CalendarDays, Users, Stethoscope, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Stethoscope className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">DentalClinic</h1>
      </div>
      
      <div className="space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ${
            isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
          }`}
        >
          <User className="h-5 w-5" />
          Dashboard
        </Link>
        
        <Link
          to="/appointments"
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ${
            isActive('/appointments') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
          }`}
        >
          <CalendarDays className="h-5 w-5" />
          Appointments
        </Link>
        
        {user?.role === 'practitioner' ? (
          <Link
            to="/patients"
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ${
              isActive('/patients') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Users className="h-5 w-5" />
            Patients
          </Link>
        ) : (
          <Link
            to="/patient-search"
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ${
              isActive('/patient-search') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Users className="h-5 w-5" />
            Patient Directory
          </Link>
        )}
      </div>
      
      <div className="absolute bottom-4 w-full left-0 px-4">
        <div className="mb-4 p-2 text-sm text-gray-600">
          Signed in as: {user?.name}
          <div className="text-xs text-gray-500 mt-1">
            Role: {user?.role === 'practitioner' ? 'Dentist' : 'Assistant'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-600 w-full"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </nav>
  );
}