import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { avatars } from "../data/avatars";
import { useNavigate } from "react-router-dom";


export  default function Welcome() {

const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      {/* Header/Navbar */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FD</span>
          </div>
          <span className="text-xl font-bold text-indigo-800">FinDev</span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">Features</a>
          <a href="#" className="text-gray-600 hover:text-indigo-800 font-medium">Pricing</a>
          <a href="#" className="text-gray-600 hover:text-indigo-800 font-medium">About</a>
        </div>
        
        <div className="flex space-x-4">
          <button onClick={()=>navigate("/login")}  className="px-4 py-2 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
            Log in
          </button>
          <button onClick={()=>navigate("/sign-up")} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Supercharge Your <span className="text-indigo-600">Job Search</span> with AI
          </h1>
          
          <p className="text-lg text-gray-600 max-w-lg">
            Track applications, optimize your resume, and get hired faster with FinDev's AI-powered job search assistant.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
              Get Started for Free
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              See How It Works
            </button>
          </div>
          
          <div className="flex items-center pt-4 space-x-2">
            <div className="flex -space-x-2">
                {avatars.map((src,index)=>(
                    <img
                    key={index}
                    src={src} // Tu peux remplacer par tes propres URLs
                    alt={`Avatar ${index}`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                />
                ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">1,000+</span> job seekers use FinDev daily
            </p>
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform rotate-1">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-gray-500">FinDev Dashboard</div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-indigo-800">Application Status</div>
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-gray-500">To apply: 5</div>
                  <div className="text-xs text-gray-500">Interview: 2</div>
                  <div className="text-xs text-gray-500">Offer: 1</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-800">AI Resume Feedback</div>
                <div className="mt-2 text-xs text-gray-500">
                  "Your skills section could be more tailored to the job description..."
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-green-800">New Opportunity</div>
                <div className="mt-2 text-xs text-gray-700">
                  Senior Frontend Developer at TechCorp
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-200 rounded-2xl -z-10"></div>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-200 rounded-2xl -z-10"></div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="max-w-6xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features to <span className="text-indigo-600">Accelerate</span> Your Job Search
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              ),
              title: "Application Tracking",
              description: "Organize all your job applications in one place with our Kanban-style dashboard."
            },
            {
              icon: (
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              ),
              title: "AI Resume Optimization",
              description: "Get tailored suggestions to improve your resume for each job application."
            },
            {
              icon: (
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              ),
              title: "Analytics Dashboard",
              description: "Track your job search performance with detailed statistics and insights."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              {feature.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto mt-24 mb-16 bg-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Job Search?</h2>
        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of job seekers who landed their dream jobs with FinDev's AI-powered tools.
        </p>
        <button className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
          Start Your Free Trial
        </button>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto pt-12 pb-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FD</span>
            </div>
            <span className="text-lg font-bold text-indigo-800">FinDev</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">Terms</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a>
          </div>
        </div>
        
        <div className="mt-6 text-center md:text-left text-sm text-gray-500">
          © {new Date().getFullYear()} FinDev. All rights reserved.
        </div>
      </footer>
    </div>
  );
};