"use client";

import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import { createVisite } from "../../../actions/visites";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormulaireVisiteProps {
    references: {
        secteurs: any[];
        typesCollecte: any[];
        statutsProjet: any[];
        taillesProjet: any[];
        equipements: any[];
        produits: any[];
        fournisseurs: any[];
        typesRelation: any[];
        satisfactions: any[];
        niveauxOpportunite: any[];
        fenetresEntree: any[];
        priorites: any[];
        typesAction: any[];
    };
}

const STEPS = [
    { label: "Général", icon: "📅" },
    { label: "Entreprise", icon: "🏢" },
    { label: "Projet", icon: "🏗️" },
    { label: "Conso.", icon: "⛽" },
    { label: "Opportunité", icon: "🎯" },
];

export default function FormulaireVisite({ references }: FormulaireVisiteProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<any>({
        date_visite: new Date().toISOString().split("T")[0],
        contacts: [{ nom: "", fonction: "", telephone: "", email: "" }],
        parc_materiel_texte: "",
        produit_ids: [],
    });
    const router = useRouter();

    const updateFormData = (data: any) => {
        setFormData((prev: any) => ({ ...prev, ...data }));
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 5));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await createVisite(formData);
            if (res.success) {
                toast.success("Fiche terrain enregistrée avec succès");
                router.push("/dashboard");
            } else {
                toast.error("Erreur: " + res.error);
            }
        } catch {
            toast.error("Une erreur inattendue s'est produite.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = Math.round((step / 5) * 100);

    return (
        <div className="form-container">
            {/* Header */}
            <div className="form-header">
                <div>
                    <div className="flex justify-between items-start w-full pr-4">
                        <div>
                            <h2 className="form-title">Nouvelle Fiche Terrain</h2>
                            <p className="form-subtitle">Étape {step} sur 5 — {STEPS[step - 1].icon} {STEPS[step - 1].label}</p>
                        </div>
                        <a 
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors group bg-surface-2 py-1.5 px-3 rounded-lg border border-border hover:border-primary/50 transition-all no-underline shadow-sm"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">Retour</span>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center group-hover:text-primary transition-all">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="progress-badge">{progress}%</div>
            </div>

            {/* Progress bar */}
            <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Stepper */}
            <div className="stepper">
                {STEPS.map((s, i) => {
                    const n = i + 1;
                    const active = n === step;
                    const done = n < step;
                    return (
                        <div key={n} className={`step-item ${active ? "active" : ""} ${done ? "done" : ""}`}
                            onClick={() => n < step && setStep(n)}>
                            <div className="step-dot">
                                {done ? "✓" : s.icon}
                            </div>
                            <span className="step-label">{s.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Form body */}
            <div className="form-body">
                {step === 1 && <Step1 data={formData} update={updateFormData} refs={references} />}
                {step === 2 && <Step2 data={formData} update={updateFormData} refs={references} />}
                {step === 3 && <Step3 data={formData} update={updateFormData} refs={references} />}
                {step === 4 && <Step4 data={formData} update={updateFormData} refs={references} />}
                {step === 5 && <Step5 data={formData} update={updateFormData} refs={references} />}
            </div>

            {/* Navigation */}
            <div className="form-nav">
                <button className="btn btn-secondary" onClick={prevStep} disabled={step === 1}>
                    ← Précédent
                </button>
                {step < 5 ? (
                    <button className="btn btn-primary" onClick={nextStep}>
                        Suivant →
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{ background: "var(--success)" }}
                    >
                        {isSubmitting ? "Enregistrement..." : "✓ Enregistrer la fiche"}
                    </button>
                )}
            </div>

            <style>{`
        .form-container {
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--card-shadow-hover);
          background: var(--surface-1);
          border: 1px solid var(--border);
        }
        @media (min-width: 640px) {
          .form-container {
            margin: 2rem auto;
          }
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1rem 0.75rem;
          border-bottom: 1px solid var(--border);
          background: var(--surface-2);
        }
        @media (min-width: 640px) {
          .form-header {
            padding: 1.75rem 2rem 1rem;
          }
        }

        .form-title {
          font-size: 1.4rem;
          font-weight: 900;
          margin: 0 0 0.25rem;
          color: var(--foreground);
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }
        .form-subtitle {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .progress-badge {
          background: var(--primary);
          color: white;
          font-weight: 900;
          font-size: 0.8rem;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }
        .progress-bar-track {
          height: 6px;
          background: var(--surface-3);
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--primary);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stepper {
          display: flex;
          padding: 1rem;
          gap: 0;
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
          background: var(--surface-1);
          -webkit-overflow-scrolling: touch;
        }
        @media (min-width: 640px) {
          .stepper {
            padding: 1.25rem 2rem;
          }
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          flex: 1;
          cursor: default;
          min-width: 60px;
          opacity: 0.3;
          transition: all 0.2s;
        }
        .step-item.done { opacity: 0.8; cursor: pointer; }
        .step-item.active { opacity: 1; }
        .step-item.done:hover { opacity: 1; }
        .step-dot {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: var(--surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid var(--border);
          color: var(--text-muted);
        }
        @media (min-width: 640px) {
          .step-dot {
            width: 38px;
            height: 38px;
            border-radius: 14px;
            font-size: 1.2rem;
          }
        }

        .step-item.active .step-dot {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          transform: scale(1.1);
          box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
        }
        .step-item.done .step-dot {
          background: var(--success);
          border-color: var(--success);
          color: white;
        }
        .step-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .step-item.active .step-label {
          color: var(--primary);
        }
        .form-body {
          padding: 1.25rem;
          min-height: 380px;
          background: var(--surface-1);
        }
        @media (min-width: 640px) {
          .form-body {
            padding: 2.5rem;
            min-height: 420px;
          }
        }

        .form-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--border);
          background: var(--surface-2);
        }
        @media (min-width: 640px) {
          .form-nav {
            padding: 1.5rem 2.5rem;
          }
        }

      `}</style>
        </div>
    );
}
