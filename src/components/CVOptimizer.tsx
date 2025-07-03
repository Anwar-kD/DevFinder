import { useState } from "react";

// Mock icons (you can replace with actual icons)
const DocumentTextIcon = ({ className }) => <div className={className}>📄</div>;
const BriefcaseIcon = ({ className }) => <div className={className}>💼</div>;
const AcademicCapIcon = ({ className }) => <div className={className}>🎓</div>;
const LightBulbIcon = ({ className }) => <div className={className}>💡</div>;
const SparklesIcon = ({ className }) => <div className={className}>✨</div>;
const ArrowDownTrayIcon = ({ className }) => (
  <div className={className}>⬇️</div>
);
const EnvelopeIcon = ({ className }) => <div className={className}>📧</div>;
const ClipboardDocumentIcon = ({ className }) => (
  <div className={className}>📋</div>
);
const UserIcon = ({ className }) => <div className={className}>👤</div>;
const KeyIcon = ({ className }) => <div className={className}>🔑</div>;

interface CVResult {
  optimizedCV: string;
  matchPercentage: number;
  keywords: string[];
  suggestions: string[];
}

export default function CVOptimizer() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvDesign, setCvDesign] = useState("modern");
  const [result, setResult] = useState<CVResult | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    experiences: "",
    skills: "",
    education: "",
    additionalInfo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData((prev) => ({
        ...prev,
        jobDescription: prev.jobDescription + text,
      }));
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      alert(
        "Impossible de lire le presse-papier. Veuillez coller manuellement."
      );
    }
  };

  // Function to call OpenAI GPT-4 API
  const callOpenAIAPI = async (prompt: string) => {
    if (!apiKey) {
      throw new Error("Clé API manquante");
    }

    const endpoint = "https://models.github.ai/inference";
    const model = "openai/gpt-4.1";

    try {
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Tu es un expert en rédaction de CV et en recrutement. Tu dois analyser une offre d'emploi et les informations d'un candidat pour créer un CV optimisé. 
              
              Réponds uniquement en français et structure ta réponse comme suit :
              1. Un CV optimisé au format markdown professionnel
              2. Un pourcentage de correspondance avec l'offre (entre 70-95%)
              3. Une liste de mots-clés stratégiques (8-10 mots maximum)
              4. 4 suggestions d'amélioration concrètes
              
              Sépare chaque section par "---SECTION---"`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          top_p: 1,
          model: model,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      throw error;
    }
  };

  // AI analysis function with real OpenAI API
  const analyzeJobDescription = async () => {
    if (!apiKey) {
      alert("Veuillez saisir votre clé API GitHub/OpenAI");
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `
      OFFRE D'EMPLOI:
      Poste: ${formData.jobTitle}
      Description: ${formData.jobDescription}
      
      PROFIL DU CANDIDAT:
      Expériences: ${formData.experiences}
      Compétences: ${formData.skills}
      Formation: ${formData.education}
      Informations supplémentaires: ${formData.additionalInfo}
      
      Optimise ce CV pour cette offre d'emploi en français. Mets en avant les éléments les plus pertinents et utilise les mots-clés de l'offre.
      `;

      const aiResponse = await callOpenAIAPI(prompt);

      // Parse the AI response
      const sections = aiResponse.split("---SECTION---");

      let optimizedCV = sections[0]?.trim() || "CV non généré";
      let matchPercentage = 85; // Default value
      let keywords: string[] = [];
      let suggestions: string[] = [];

      // Extract match percentage
      const matchMatch = aiResponse.match(/(\d+)%/);
      if (matchMatch) {
        matchPercentage = parseInt(matchMatch[1]);
      }

      // Extract keywords (look for lists or comma-separated values)
      const keywordMatch = aiResponse.match(/mots[- ]clés?\s*:?\s*([^\n]+)/i);
      if (keywordMatch) {
        keywords = keywordMatch[1]
          .split(/[,;]/)
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
          .slice(0, 8);
      }

      // Extract suggestions (look for numbered lists or bullet points)
      const suggestionMatches = aiResponse.match(/\d+\.\s*([^\n]+)/g);
      if (suggestionMatches) {
        suggestions = suggestionMatches
          .map((s) => s.replace(/^\d+\.\s*/, "").trim())
          .slice(0, 4);
      }

      // Fallback suggestions if none found
      if (suggestions.length === 0) {
        suggestions = [
          "Quantifiez vos réalisations avec des chiffres",
          "Utilisez les mots-clés de l'offre d'emploi",
          "Mettez en avant vos compétences techniques",
          "Adaptez votre profil à l'entreprise cible",
        ];
      }

      // Fallback keywords if none found
      if (keywords.length === 0) {
        keywords = formData.jobDescription
          .split(" ")
          .filter((word) => word.length > 4)
          .slice(0, 8)
          .map((word) => word.replace(/[^\w]/g, ""));
      }

      const result: CVResult = {
        optimizedCV,
        matchPercentage,
        keywords,
        suggestions,
      };

      setResult(result);
      setStep(3);
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      alert(
        "Erreur lors de la génération du CV. Vérifiez votre clé API et réessayez."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCV = () => {
    if (!result) return;

    try {
      // Convert markdown to HTML
      const htmlContent = result.optimizedCV
        .replace(/# (.*)/g, "<h1>$1</h1>")
        .replace(/## (.*)/g, "<h2>$1</h2>")
        .replace(/### (.*)/g, "<h3>$1</h3>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>");

      // Create HTML document
      const wordContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>CV Optimisé par IA</title>
          <style>
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              margin: 40px; 
              line-height: 1.6; 
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
            }
            h1 { 
              color: #2563eb; 
              border-bottom: 3px solid #2563eb; 
              padding-bottom: 10px; 
              margin-bottom: 20px;
              font-size: 2.2em;
            }
            h2 { 
              color: #1e40af; 
              margin-top: 30px; 
              margin-bottom: 15px;
              font-size: 1.4em;
              border-left: 4px solid #3b82f6;
              padding-left: 15px;
            }
            h3 {
              color: #1e40af;
              margin-top: 20px;
              margin-bottom: 10px;
              font-size: 1.1em;
            }
            p { margin: 10px 0; }
            .header-info { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white;
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 10px;
              text-align: center;
            }
            .match-rate { 
              background: #f0f9ff; 
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 10px;
              border-left: 5px solid #3b82f6;
            }
            .keywords { 
              background: #f0f9ff; 
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 10px;
              border-left: 5px solid #06b6d4;
            }
            .suggestions { 
              background: #f0fdf4; 
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 10px;
              border-left: 5px solid #10b981;
            }
            .cv-content {
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              margin: 20px 0;
            }
            .keyword-tag {
              display: inline-block;
              background: #e0f2fe;
              color: #0891b2;
              padding: 5px 12px;
              margin: 3px;
              border-radius: 20px;
              font-size: 0.9em;
              font-weight: 500;
            }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
            strong { color: #1e40af; }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #6b7280;
              font-size: 0.9em;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header-info">
            <h1>CV Optimisé par Intelligence Artificielle</h1>
            <p>Généré le ${new Date().toLocaleDateString("fr-FR")}</p>
          </div>
          
          <div class="match-rate">
            <h3>📊 Analyse de correspondance</h3>
            <p><strong>Taux de correspondance avec l'offre: ${
              result.matchPercentage
            }%</strong></p>
            <p>Ce CV a été optimisé par IA pour maximiser vos chances de sélection.</p>
          </div>
          
          <div class="keywords">
            <h3>🔑 Mots-clés stratégiques identifiés</h3>
            <div>
              ${result.keywords
                .map((keyword) => `<span class="keyword-tag">${keyword}</span>`)
                .join("")}
            </div>
            <p style="margin-top: 15px;"><em>Ces mots-clés ont été intégrés dans votre CV pour améliorer sa visibilité.</em></p>
          </div>
          
          <div class="cv-content">
            <p>${htmlContent}</p>
          </div>
          
          <div class="suggestions">
            <h3>💡 Recommandations personnalisées de l'IA</h3>
            <ul>
              ${result.suggestions
                .map((suggestion) => `<li>${suggestion}</li>`)
                .join("")}
            </ul>
            <p><em>Ces suggestions ont été générées par l'IA pour optimiser davantage votre profil.</em></p>
          </div>
          
          <div class="footer">
            <p>Ce CV a été généré et optimisé par Intelligence Artificielle GPT-4</p>
            <p>Poste ciblé: <strong>${formData.jobTitle}</strong></p>
          </div>
        </body>
        </html>
      `;

      // Create and download file
      const blob = new Blob([wordContent], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CV_IA_Optimise_${
        formData.jobTitle.replace(/\s+/g, "_") || "CV"
      }.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("CV optimisé par IA téléchargé avec succès !");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      alert("Erreur lors du téléchargement du CV");
    }
  };

  const sendEmail = () => {
    if (!result) return;

    const subject = `CV optimisé par IA - ${formData.jobTitle}`;
    const body = `Bonjour,

Voici votre CV optimisé par Intelligence Artificielle GPT-4 pour le poste de ${
      formData.jobTitle
    }.

🤖 ANALYSE IA :
Taux de correspondance avec l'offre : ${result.matchPercentage}%

🔑 MOTS-CLÉS STRATÉGIQUES :
${result.keywords.join(", ")}

💡 RECOMMANDATIONS IA :
${result.suggestions
  .map((suggestion, index) => `${index + 1}. ${suggestion}`)
  .join("\n")}

Ce CV a été généré et optimisé par Intelligence Artificielle pour maximiser vos chances de sélection.

Cordialement`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <SparklesIcon className="h-8 w-8 text-indigo-600 mr-3" />
        Optimisation de CV avec IA GPT-4
      </h1>

      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
            <h2 className="text-lg font-semibold text-indigo-800 mb-2">
              🤖 Optimisation par Intelligence Artificielle
            </h2>
            <p className="text-indigo-700 mb-4">
              Notre IA GPT-4 va analyser l'offre d'emploi et générer un CV
              personnalisé pour maximiser vos chances d'être sélectionné.
            </p>

            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <KeyIcon className="h-5 w-5 mr-2 text-indigo-600" />
                Clé API GitHub/OpenAI *
              </label>
              <div className="flex space-x-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Votre clé API GitHub Token"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {showApiKey ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Votre clé API est nécessaire pour utiliser GPT-4. Elle n'est pas
                sauvegardée.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
                Poste souhaité *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Développeur Frontend Senior"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Description de l'offre *
                </label>
                <button
                  onClick={handlePaste}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                  Coller depuis le presse-papier
                </button>
              </div>
              <textarea
                name="jobDescription"
                rows={6}
                value={formData.jobDescription}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Copiez-collez ici le texte complet de l'offre d'emploi..."
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={
                !formData.jobTitle || !formData.jobDescription || !apiKey
              }
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <UserIcon className="h-6 w-6 mr-2 text-indigo-600" />
            Vos informations
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
                Expériences professionnelles *
              </label>
              <textarea
                name="experiences"
                rows={4}
                value={formData.experiences}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: 2019-2023 : Développeur Frontend chez ABC Corp - Développement d'applications React, amélioration des performances de 40%..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <LightBulbIcon className="h-5 w-5 mr-2 text-gray-500" />
                Compétences clés *
              </label>
              <textarea
                name="skills"
                rows={3}
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: React, TypeScript, Node.js, MongoDB, Git, Agile, Leadership..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-500" />
                Diplômes et formations
              </label>
              <textarea
                name="education"
                rows={3}
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: 2018 : Master en Informatique - Université XYZ, mention Bien..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations supplémentaires (optionnel)
              </label>
              <textarea
                name="additionalInfo"
                rows={2}
                value={formData.additionalInfo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Langues parlées, certifications, projets personnels..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Retour
              </button>
              <button
                onClick={analyzeJobDescription}
                disabled={
                  isGenerating ||
                  !formData.experiences ||
                  !formData.skills ||
                  !apiKey
                }
                className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  isGenerating ||
                  !formData.experiences ||
                  !formData.skills ||
                  !apiKey
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isGenerating
                  ? "🤖 IA en cours d'analyse..."
                  : "🚀 Optimiser avec l'IA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-medium text-green-800 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2" />
              🤖 L'IA a optimisé votre CV à {result.matchPercentage}% avec
              l'offre !
            </h3>
            <p className="text-green-700 mt-2">
              CV généré par Intelligence Artificielle GPT-4 et personnalisé pour
              ce poste.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  🤖 CV Optimisé par IA
                </h3>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {result.optimizedCV}
                  </pre>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  🎯 Recommandations de l'IA
                </h3>
                <div className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start bg-blue-50 p-3 rounded-lg"
                    >
                      <span className="flex-shrink-0 h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  🧠 Mots-clés détectés par l'IA
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">🎨 Style du CV</h3>
                <select
                  value={cvDesign}
                  onChange={(e) => setCvDesign(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  💾 Télécharger le CV IA
                </button>
                <button
                  onClick={sendEmail}
                  className="w-full flex items-center justify-center px-4 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  📧 Envoyer par email
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setResult(null);
                    setFormData({
                      jobTitle: "",
                      jobDescription: "",
                      experiences: "",
                      skills: "",
                      education: "",
                      additionalInfo: "",
                    });
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  🔄 Nouveau CV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
