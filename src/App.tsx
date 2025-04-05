import React, { useState } from 'react';
import { Ambulance, Calendar, Bed, MapPin, Clock, Phone } from 'lucide-react';

interface EmergencyRequest {
  id: string;
  patientName: string;
  location: string;
  status: 'pending' | 'dispatched' | 'completed';
  timestamp: string;
  distance: string;
  contactNumber: string;
  coordinates?: { lat: number; lng: number };
}

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

interface BedStatus {
  total: number;
  occupied: number;
  available: number;
  icu: {
    total: number;
    available: number;
  };
  emergency: {
    total: number;
    available: number;
  };
  general: {
    total: number;
    available: number;
  };
}

const ReceptionistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'appointments' | 'beds'>('emergency');
  
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([
    {
      id: '1',
      patientName: 'John Doe',
      location: '123 Emergency St',
      status: 'pending',
      timestamp: '2 mins ago',
      distance: '2.5 km',
      contactNumber: '+1 234-567-8900',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      location: '456 Medical Ave',
      status: 'dispatched',
      timestamp: '5 mins ago',
      distance: '3.8 km',
      contactNumber: '+1 234-567-8901',
      coordinates: { lat: 40.7142, lng: -74.0064 }
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Alice Johnson',
      doctorName: 'Dr. Smith',
      department: 'Cardiology',
      date: '2024-03-20',
      time: '10:00 AM',
      status: 'scheduled'
    },
    {
      id: '2',
      patientName: 'Bob Wilson',
      doctorName: 'Dr. Brown',
      department: 'Orthopedics',
      date: '2024-03-20',
      time: '11:30 AM',
      status: 'in-progress'
    }
  ]);

  const [bedStatus, setBedStatus] = useState<BedStatus>({
    total: 100,
    occupied: 75,
    available: 25,
    icu: {
      total: 20,
      available: 5
    },
    emergency: {
      total: 15,
      available: 3
    },
    general: {
      total: 65,
      available: 17
    }
  });

  const handleDispatch = (requestId: string) => {
    setEmergencyRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: 'dispatched' } 
        : request
    ));
  };

  const updateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    ));
  };

  const updateBedStatus = (type: 'icu' | 'emergency' | 'general', change: number) => {
    setBedStatus(prev => {
      const newStatus = { ...prev };
      const currentAvailable = newStatus[type].available;
      const maxAvailable = newStatus[type].total;
      
      // Ensure we don't go below 0 or above total beds
      const newAvailable = Math.max(0, Math.min(maxAvailable, currentAvailable + change));
      
      newStatus[type].available = newAvailable;
      
      // Update total available and occupied counts
      const totalAvailable = 
        newStatus.icu.available + 
        newStatus.emergency.available + 
        newStatus.general.available;
      
      newStatus.available = totalAvailable;
      newStatus.occupied = newStatus.total - totalAvailable;
      
      return newStatus;
    });
  };

  const trackAmbulance = (requestId: string) => {
    const request = emergencyRequests.find(r => r.id === requestId);
    if (request?.coordinates) {
      window.open(`https://www.google.com/maps?q=${request.coordinates.lat},${request.coordinates.lng}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Receptionist Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage emergency requests, appointments, and bed availability</p>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-6 py-3 rounded-xl flex items-center transition-all duration-200 transform hover:scale-105 ${
              activeTab === 'emergency'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Ambulance className="w-5 h-5 mr-2" />
            Emergency Requests
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 rounded-xl flex items-center transition-all duration-200 transform hover:scale-105 ${
              activeTab === 'appointments'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('beds')}
            className={`px-6 py-3 rounded-xl flex items-center transition-all duration-200 transform hover:scale-105 ${
              activeTab === 'beds'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Bed className="w-5 h-5 mr-2" />
            Bed Status
          </button>
        </div>

        {activeTab === 'emergency' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Emergency Requests</h2>
            <div className="space-y-4">
              {emergencyRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{request.patientName}</h3>
                        <span className={`ml-4 px-4 py-1 rounded-full text-sm font-medium ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                          {request.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-5 h-5 mr-2 text-gray-400" />
                          {request.timestamp}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-5 h-5 mr-2 text-gray-400" />
                          {request.contactNumber}
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 space-x-3">
                      {request.status === 'pending' && (
                        <button 
                          onClick={() => handleDispatch(request.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center"
                        >
                          <Ambulance className="w-5 h-5 mr-2" />
                          Dispatch Ambulance
                        </button>
                      )}
                      {request.status === 'dispatched' && (
                        <button 
                          onClick={() => trackAmbulance(request.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          Track Location
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Today's Appointments</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 rounded-lg">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Doctor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{appointment.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{appointment.doctorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{appointment.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{appointment.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === 'scheduled'
                            ? 'bg-yellow-100 text-yellow-800'
                            : appointment.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={appointment.status}
                          onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as Appointment['status'])}
                          className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'beds' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Bed Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Total Beds</h3>
                <p className="text-4xl font-bold text-blue-900 mb-2">{bedStatus.total}</p>
                <p className="text-sm text-blue-600">Currently Available: {bedStatus.available}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">ICU Beds</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-4xl font-bold text-purple-900">{bedStatus.icu.available}</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => updateBedStatus('icu', -1)}
                      className="px-3 py-1 bg-purple-200 text-purple-700 rounded-lg hover:bg-purple-300"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateBedStatus('icu', 1)}
                      className="px-3 py-1 bg-purple-200 text-purple-700 rounded-lg hover:bg-purple-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-sm text-purple-600">Total: {bedStatus.icu.total}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Emergency Beds</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-4xl font-bold text-red-900">{bedStatus.emergency.available}</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => updateBedStatus('emergency', -1)}
                      className="px-3 py-1 bg-red-200 text-red-700 rounded-lg hover:bg-red-300"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateBedStatus('emergency', 1)}
                      className="px-3 py-1 bg-red-200 text-red-700 rounded-lg hover:bg-red-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-sm text-red-600">Total: {bedStatus.emergency.total}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-green-700 mb-2">General Beds</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-4xl font-bold text-green-900">{bedStatus.general.available}</p>
                  <div className="space-x-2">
                    <button
                      onClick={() => updateBedStatus('general', -1)}
                      className="px-3 py-1 bg-green-200 text-green-700 rounded-lg hover:bg-green-300"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateBedStatus('general', 1)}
                      className="px-3 py-1 bg-green-200 text-green-700 rounded-lg hover:bg-green-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-sm text-green-600">Total: {bedStatus.general.total}</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Bed Allocation Overview</h3>
              <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${(bedStatus.occupied / bedStatus.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-3 text-sm font-medium">
                <span className="text-gray-600">Occupied: {bedStatus.occupied}</span>
                <span className="text-gray-600">Available: {bedStatus.available}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;