import { 
  ArrowLeftIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PaperClipIcon
} from "@heroicons/react/24/outline";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../config/firebase-config";

interface JobOffer {
  id: string;
  title: string;
  company: string;
  url:string,
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
}

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: File | null;
}

// Interface séparée pour les erreurs
interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
  resume?: string;
}

export const JobApplication = () => {
  const { offerId } = useParams();
  const [offer, setOffer] = useState<JobOffer|null>(null);

  useEffect(() => {
    if (offerId) {
      const fetchOffer = async () => {
        const docRef = doc(db, 'offers', offerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOffer(docSnap.data() as JobOffer);
        }
      };
      fetchOffer();
    }
  }, [offerId]);  
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({}); // ✅ Interface correcte

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        resume: e.target.files![0]
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {}; // ✅ Plus d'erreur TypeScript
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.coverLetter) newErrors.coverLetter = 'Cover letter is required';
    if (!formData.resume) newErrors.resume = 'Resume is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        console.log('Application submitted:', { offer, formData });
        setIsSubmitting(false);
        navigate('/applications?success=true');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/offers")}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to offers
          </button>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{offer?.title}</h1>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-indigo-500" />
                <span>{offer?.company}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2 text-indigo-500" />
                <span>{offer?.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                <span>{offer?.salary}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-2 text-indigo-500" />
                <span>{offer?.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Application Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <UserIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <PaperClipIcon className="h-4 w-4 mr-1 text-gray-500" />
                Upload Resume
              </label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.resume ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-md`}>
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 5MB
                  </p>
                  {formData.resume && (
                    <p className="text-sm text-gray-900 mt-2">
                      Selected: {formData.resume.name}
                    </p>
                  )}
                </div>
              </div>
              {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
            </div>

            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={6}
                value={formData.coverLetter}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${errors.coverLetter ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Explain why you're a good fit for this position..."
              />
              {errors.coverLetter && <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>}
            </div>

            {/* Job Details */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Job Details</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Position:</span> {offer?.title}
                </p>
                <p className="text-sm text-gray-700">
                  {/* <span className="font-medium">Company:</span> {offer.company} */}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Location:</span> {offer?.location}
                </p>
              </div>
              {/* Job Description */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
                    <div className="prose max-w-none text-gray-600">
                        {offer?.description.split('\n').map((paragraph, i) => {
                        const [beforeColon, afterColon] = paragraph.split(/:(.*)/s); // Séparer au premier `:`

                        return (
                            <p key={i} className="mb-3">
                            {afterColon !== undefined ? (
                                <>
                                <strong>{beforeColon}:</strong>
                                {afterColon}
                                </>
                            ) : (
                                paragraph // Pas de `:`, on affiche tel quel
                            )}
                            </p>
                        );
                        })}
                    </div>
                </div>
            </div>
            
            
            
            
            {/* Job URL */}
            <div className="mt-6">
              <a 
                href={offer?.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View original job posting
              </a>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
        </div>
    </div>
  );
};