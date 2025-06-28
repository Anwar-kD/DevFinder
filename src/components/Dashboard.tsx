import { 
  BellIcon,
  ChartBarIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CogIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useGetOffers } from "../hooks/useGetOffers";
import {importJobsFromApi} from "../hooks/fetchAndStoreOffers";
export const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const userName = currentUser?.displayName || 'Utilisateur';
  const [firstName, ...lastNameParts] = userName.split(' ');
  const lastName = lastNameParts.join(' ');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const importData = async () => {
      if (!isImporting) {
        setIsImporting(true);
        try {
          await importJobsFromApi();
        } catch (error) {
          console.error("Erreur import:", error);
        } finally {
          setIsImporting(false);
        }
      }
    };
    
    importData();
  }, []); // Dépendances vides pour n'exécuter qu'une fois

  const {offers} = useGetOffers();
  
  const applications = [
    { id: 1, company: "TechCorp", position: "Frontend Developer", status: "interview", date: "2023-05-15" },
    { id: 2, company: "DataSystems", position: "Data Analyst", status: "applied", date: "2023-05-10" },
    { id: 3, company: "DesignHub", position: "UI Designer", status: "offer", date: "2023-05-05" },
    { id: 4, company: "CloudNet", position: "DevOps Engineer", status: "rejected", date: "2023-05-01" },
  ];

  const stats = [
    { name: 'Applications Sent', value: 24, change: '+4%', changeType: 'positive' },
    { name: 'Interviews', value: 8, change: '+2', changeType: 'positive' },
    { name: 'Offers', value: 3, change: '+1', changeType: 'positive' },
    { name: 'Rejection Rate', value: '32%', change: '-5%', changeType: 'negative' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow pt-6 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center justify-center px-4 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FD</span>
            </div>
            <span className="ml-2 text-xl font-bold text-indigo-800"></span>
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
            <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg">
              <ChartBarIcon className="h-5 w-5 mr-3" />
              Dashboard
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg">
              <DocumentTextIcon className="h-5 w-5 mr-3" />
              Applications
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg">
              <EnvelopeIcon className="h-5 w-5 mr-3" />
              Cover Letters
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg">
              <UserIcon className="h-5 w-5 mr-3" />
              Resume
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg">
              <CogIcon className="h-5 w-5 mr-3" />
              Settings
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700"> {userName}</span>
                <button
                    onClick={logout}
                    className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 bg-red-100 rounded-lg"
                  >
                    Se déconnecter
                  </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="mt-4 flex items-center">
                  <ArrowTrendingUpIcon className={`h-4 w-4 ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`ml-1 text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? 'Up' : 'Down'} from last week
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Available Job Offers Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <BriefcaseIcon className="h-5 w-5 text-indigo-600 mr-2" />
                Available Job Offers
              </h2>
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Refresh Offers
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer, index) => {
                const {title,employer,url,date, location} = offer;
                return(
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-indigo-700">{title}</h3>
<a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
  Lien de l'offre
</a>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">{date}</span>
                    <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      Quick Apply
                    </button>
                  </div>
                </div> 
                )
            })}
            </div>
            
            <div className="mt-6 text-center">
              <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                View all available offers →
              </button>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Add Application
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{application.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{application.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === 'offer' 
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'interview'
                            ? 'bg-blue-100 text-blue-800'
                            : application.status === 'applied'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {application.status === 'offer' 
                            ? 'Offer Received'
                            : application.status === 'interview'
                            ? 'Interview'
                            : application.status === 'applied'
                            ? 'Applied'
                            : 'Rejected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{application.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Optimization */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Resume Optimization</h2>
                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">AI Powered</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Strong points</p>
                    <p className="text-sm text-gray-500">Your React and TypeScript experience matches 92% of frontend job requirements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <XCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Needs improvement</p>
                    <p className="text-sm text-gray-500">Consider adding more details about your team leadership experience.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Suggestions</p>
                    <p className="text-sm text-gray-500">Tailor your skills section to include more keywords from job descriptions.</p>
                  </div>
                </div>
              </div>
              <button className="mt-6 w-full px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors">
                Optimize Now
              </button>
            </div>

            {/* Job Recommendations */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Job Recommendations</h2>
                <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">3 New</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex justify-between">
                    <p className="font-medium text-indigo-800">Senior Frontend Developer</p>
                    <span className="text-xs text-indigo-600">95% match</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">TechCorp • Remote • $120k - $150k</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">UI/UX Engineer</p>
                    <span className="text-xs text-gray-600">88% match</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">DesignHub • Hybrid • $110k - $130k</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">Full Stack Developer</p>
                    <span className="text-xs text-gray-600">82% match</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">WebSolutions • On-site • $100k - $130k</p>
                </div>
              </div>
              <button className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                View All Recommendations
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};