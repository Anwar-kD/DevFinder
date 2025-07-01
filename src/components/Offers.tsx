import { 
  BriefcaseIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  XMarkIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useGetOffers } from "../hooks/useGetOffers";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";


export const Offers = () => {
  const { offers } = useGetOffers();
  const { currentUser, logout } = useAuth();
  const userName = currentUser?.displayName || 'Utilisateur';
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [filteredOffers, setFilteredOffers] = useState(offers);
  const [showFilters, setShowFilters] = useState(false);

  // Appliquer les filtres
  useEffect(() => {
    let result = [...offers];
    
    if (searchTerm) {
      result = result.filter(offer => 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (offer.employer?.name && offer.employer.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (locationFilter) {
      result = result.filter(offer => 
        offer.location?.city?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (salaryFilter) {
      // Ici vous devrez adapter en fonction de comment les salaires sont stockés
      result = result.filter(offer => 
        offer.benefits?.salary?.includes(salaryFilter)
      );
    }
    
    if (jobTypeFilter) {
      result = result.filter(offer => 
        offer.benefits?.jobType?.includes(jobTypeFilter)
      );
    }
    
    setFilteredOffers(result);
  }, [searchTerm, locationFilter, salaryFilter, jobTypeFilter, offers]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setSalaryFilter("");
    setJobTypeFilter("");
    setFilteredOffers(offers);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Top Navigation (identique au dashboard) */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          {/* ... Votre top navigation existante ... */}
        </div>

        {/* Main Content Area */}
        <main className="p-6">
          {/* Header avec recherche et filtres */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BriefcaseIcon className="h-6 w-6 text-indigo-600 mr-2" />
                Available Job Offers
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredOffers.length} offers found
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              {/* Barre de recherche */}
              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Bouton filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
              
              {/* Bouton reset */}
              {(searchTerm || locationFilter || salaryFilter || jobTypeFilter) && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  Reset
                </button>
              )}
            </div>
          </div>
          
          {/* Panneau des filtres */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtre par localisation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="City, country..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
                
                {/* Filtre par salaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Salary Range
                  </label>
                  <select
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={salaryFilter}
                    onChange={(e) => setSalaryFilter(e.target.value)}
                  >
                    <option value="">All salaries</option>
                    <option value="50k">$50k+</option>
                    <option value="80k">$80k+</option>
                    <option value="100k">$100k+</option>
                    <option value="120k">$120k+</option>
                  </select>
                </div>
                
                {/* Filtre par type de contrat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Job Type
                  </label>
                  <select
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                  >
                    <option value="">All types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Liste des offres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <div key={offer.key} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-indigo-700">{offer.title}</h3>
                      <p className="text-gray-600 mt-1">{offer.employer?.name}</p>
                    </div>
                    {offer.employer?.logoUrl && (
                      <img 
                        src={offer.employer.logoUrl} 
                        alt={`${offer.employer.name} logo`} 
                        className="h-10 w-10 object-contain"
                      />
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{offer.location?.city || 'Location not specified'}</span>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {offer.description?.text || 'No description available'}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{offer.date}</span>
                    <a 
                      href={offer.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      View Offer
                    </a>
                    <a 
                      href={`/application/${offer.key}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Apply Offer
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="flex flex-col items-center justify-center">
                  <BriefcaseIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No offers found</h3>
                  <p className="text-gray-500 mt-1">
                    {offers.length === 0 ? 
                      "No offers available at the moment" : 
                      "Try adjusting your search or filters"
                    }
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Reset filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};