// components/Sidebar.tsx
import {
  ChartBarIcon, DocumentTextIcon, EnvelopeIcon,
  UserIcon, CogIcon, MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  const colorClass = `bg-indigo-600 text-indigo-800`;

  return (
    <div className={`hidden md:flex md:w-64 md:flex-col fixed inset-y-0 bg-white border-r border-gray-200`}>
      <div className="flex flex-col flex-grow pt-6 overflow-y-auto">
        <div className="flex items-center justify-center px-4 mb-8">
          <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">FD</span>
          </div>
        </div>
        <div className="px-4 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search..."
            />
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavLink to="/dashboard" className="sidebar-link">
            <ChartBarIcon className="icon" />
            Dashboard
          </NavLink>
          <NavLink to="/applications" className="sidebar-link">
            <DocumentTextIcon className="icon" />
            Applications
          </NavLink>
          <NavLink to="/offers" className={({isActive})=>isActive ? 'sidebar-link active' : 'sidebar-link' }>
            <DocumentTextIcon className="icon" />
            Offers
          </NavLink>
          <NavLink to="/coverletters" className={({isActive})=>isActive ? 'sidebar-link active' : 'sidebar-link' }>
            <EnvelopeIcon className="icon" />
            Cover Letters
          </NavLink>
          <NavLink to="/resume" className={({isActive})=>isActive ? 'sidebar-link active' : 'sidebar-link' }>
            <UserIcon className="icon" />
            Resume
          </NavLink>
          <NavLink to="/settings" className={({isActive})=>isActive ? 'sidebar-link active' : 'sidebar-link' }>
            <CogIcon className="icon" />
            Settings
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
