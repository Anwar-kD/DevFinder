import { ArrowRightIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import {auth,provider} from '../config/firebase-config'
import { signInWithPopup } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { use, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export  function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(
        {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    );
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        terms?: string;
        general?: string;
    }>({});
    const [agreedToTerms, setAgreedToTerms] = useState(false);


    const handleInputChanges=(e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev)=>({
            ...prev,
            [name]: value
        }));
        setErrors((prev)=>({
            ...prev,
            [name]: ""
        }));
    }
    const validateForm = () =>{
        const newErrors: { [key: string]: string } = {}
        if (!formData.name.trim()) {
            newErrors.name = "Le nom est requis";
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email invalide";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }

        if (!agreedToTerms) {
            newErrors.terms = "Vous devez accepter les conditions";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
          const { signup,signInWithGoogle  } = useAuth();
    
    const handleSignup = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await signup( formData.email, formData.password, formData.name);
            // Réinitialiser le formulaire
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });
            setAgreedToTerms(false);
            navigate("/dashboard");
        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
            setErrors({ general: "Erreur lors de la création du compte" });
        }
    };
    const handleSignInWithGoogle = async () => {
      try {
          await signInWithGoogle()
      } catch (error) {
        console.log(error);
      }
    };
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
            
            <div className="flex items-center space-x-4">
            <span className="text-gray-600">Already have an account?</span>
            <a 
                href="/login" 
                className="px-4 py-2 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
                Log in
            </a>
            </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600 mb-8">
                Start tracking your job applications with AI-powered insights.
            </p>
            
            <form className="space-y-6">
                {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {errors.general}
                        </div>
                    )}
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className={`block text-gray-900 w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                            ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="John Doe"
                        onChange={handleInputChanges}
                    />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block text-gray-900 w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                            ${errors.email ? 'border-red-300' : 'border-gray-300'}`}                    placeholder="you@example.com"
                    onChange={handleInputChanges}
                     />
                </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1" >
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`block text-gray-900 w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                            ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="••••••••"
                    onChange={handleInputChanges}
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    Must be at least 8 characters
                </p>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className={`block text-gray-900 w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                            ${errors.confirmPassword  ? 'border-red-300' : 'border-gray-300'}`}                        placeholder="••••••••"
                        onChange={handleInputChanges}                        />
                    </div>
                    <h3 className="text-sm font-medium text-red-300 mb-1 invisible">password incompatible</h3>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
                
                <div className="flex items-center">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>
                </label>
                {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}
                </div>
                
                <div>
                <button
                    type="button"
                    className="w-full flex justify-center items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={handleSignup}
                >
                    Create Account
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
                </div>
            </form>
            
            <div className="mt-6">
                <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                    Or continue with
                    </span>
                </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        {/* GitHub SVG Icon */}
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.033 2.73.793.092-.608.35-1.034.636-1.276-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Sign up with GitHub</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleSignInWithGoogle}
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        {/* Google SVG Icon */}
                        <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        <path d="M1 1h22v22H1z" fill="none"/>
                        </svg>
                        <span className="sr-only">Sign up with Google</span>
                    </button>
                </div>
            </div>
            </div>
            
            {/* Right Column - Illustration */}
            <div className="hidden md:block">
            <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform rotate-1 max-w-md">
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
                    <div className="text-sm font-medium text-indigo-800">Welcome to FinDev</div>
                    <div className="mt-2 text-xs text-gray-500">
                        Complete your profile to get personalized job recommendations.
                    </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-800">Your Progress</div>
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full w-1/3"></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Profile 33% complete</div>
                    </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-800">Quick Start</div>
                    <div className="mt-2 text-xs text-gray-700 space-y-2">
                        <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Upload your resume</span>
                        </div>
                        <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Add your first application</span>
                        </div>
                        <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                        <span>Get AI feedback</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-200 rounded-2xl -z-10"></div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-200 rounded-2xl -z-10"></div>
            </div>
            </div>
        </main>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto pt-12 pb-6 border-t border-gray-200 mt-12">
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