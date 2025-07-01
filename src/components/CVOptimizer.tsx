import { useState, useRef } from 'react';
import { 
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LightBulbIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  ClipboardDocumentIcon,UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

interface CVResult {
  optimizedCV: string;
  matchPercentage: number;
  keywords: string[];
  suggestions: string[];
}

export const CVOptimizer = () => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvDesign, setCvDesign] = useState('modern');
  const [result, setResult] = useState<CVResult|null>(null);
  const textareaRef = useRef(null);

  // Données du formulaire
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    experiences: '',
    skills: '',
    education: '',
    additionalInfo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData(prev => ({
        ...prev,
        jobDescription: prev.jobDescription + text
      }));
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

      interface dataUser {
        poste:string
        description:string
        experiences:string
        competences:string
        diplomes:string
    }
  const analyzeJobDescription = () => {
    interface Transaction {
  id: string;
  description: string;
  transactionAmount: number;
  transactionType: string;
  createdAt: any; // Firebase Timestamp
}
function formatTransactionsForAI(transactions: Transaction[]): string {
  return transactions.map((t) => {
    const date = t.createdAt.toDate?.().toLocaleDateString?.() || "unknown date";
    return `- ${t.description} (${t.transactionType}): ${t.transactionAmount} on ${date}`;
  }).join("\n");
}

    const dataUser = {
        poste:
        description:
        experiences:
        competences:
        diplomes:
    }
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const endpoint = "https://models.github.ai/inference/chat/completions";
    const model = "openai/gpt-4.1";

    if (!token) return null;

    const historyString = formatTransactionsForAI(dataUser);

    try {
        const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            messages: [
            { role: "system", content: "You are a helpful finance assistant." },
            {
                role: "user",
                content: `Here is my transaction history:\n${historyString}`,
            },
            ...messages,
            ],
            temperature: 1,
            top_p: 1,
        }),
        });

        const data = await response.json();

        if (!response.ok) return null;

        return data.choices[0].message.content;
    } catch (error) {
        console.error("AI error", error);
        return null;
    }
    }


    // Ici vous intégrerez votre appel API à OpenAI/GPT
    setIsGenerating(true);
    
    // Simulation de traitement
    setTimeout(() => {
      setResult({
        optimizedCV: `## ${formData.jobTitle} Professional\n\n**Expériences clés:**\n${formData.experiences}\n\n**Compétences:**\n${formData.skills}\n\n**Formation:**\n${formData.education}`,
        matchPercentage: 87,
        keywords: ['React', 'TypeScript', 'Leadership', 'Agile'],
        suggestions: [
          'Mettez plus en avant votre expérience avec Redux',
          'Ajoutez des métriques quantifiables à vos expériences',
          'Réorganisez les sections pour correspondre à la priorité de l\'offre'
        ]
      });
      setIsGenerating(false);
      setStep(3);
    }, 2000);
    
  };

  const downloadCV = () => {
    // Logique de génération de PDF
    console.log('Téléchargement du CV optimisé');
  };

  const sendEmail = () => {
    // Logique d'envoi par email
    console.log('Envoi du CV par email à', currentUser?.email);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <SparklesIcon className="h-8 w-8 text-indigo-600 mr-2" />
        Optimisation de CV avec IA
      </h1>

      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-indigo-800">
              Notre IA va analyser l'offre d'emploi et adapter votre CV pour maximiser vos chances.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-500" />
                Poste souhaité
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Développeur Frontend Senior"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-500" />
                  Description de l'offre (copiez-collez l'annonce)
                </label>
                <button
                  onClick={handlePaste}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                  Coller depuis le presse-papier
                </button>
              </div>
              <textarea
                ref={textareaRef}
                name="jobDescription"
                rows={6}
                value={formData.jobDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Copiez-collez ici le texte complet de l'offre d'emploi..."
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Vos informations
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-500" />
                Expériences professionnelles
              </label>
              <textarea
                name="experiences"
                rows={4}
                value={formData.experiences}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Décrivez vos expériences (1 par ligne)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <LightBulbIcon className="h-4 w-4 mr-2 text-gray-500" />
                Compétences clés
              </label>
              <textarea
                name="skills"
                rows={3}
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Listez vos compétences (séparées par des virgules)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-500" />
                Diplômes et formations
              </label>
              <textarea
                name="education"
                rows={3}
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Listez vos diplômes (1 par ligne)"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                onClick={analyzeJobDescription}
                disabled={isGenerating}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isGenerating ? 'Analyse en cours...' : 'Optimiser mon CV'}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-medium text-green-800 flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2" />
              Votre CV est optimisé à {result.matchPercentage}% avec l'offre !
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-3">CV Optimisé</h3>
                <div className="prose whitespace-pre-wrap">
                  {result.optimizedCV}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Suggestions d'amélioration</h3>
                <ul className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Mots-clés stratégiques</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Design du CV</h3>
                <select
                  value={cvDesign}
                  onChange={(e) => setCvDesign(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="modern">Moderne</option>
                  <option value="professional">Professionnel</option>
                  <option value="creative">Créatif</option>
                  <option value="minimal">Minimaliste</option>
                </select>
              </div>

              <div className="space-y-3">
                <button
                  onClick={downloadCV}
                  className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Télécharger en PDF
                </button>
                <button
                  onClick={sendEmail}
                  className="w-full flex items-center justify-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Envoyer à mon email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};