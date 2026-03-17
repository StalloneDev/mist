"use client";

import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import { createVisite } from "../../../actions/visites";
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
                router.push("/dashboard");
            } else {
                alert("Erreur: " + res.error);
            }
        } catch {
            alert("Une erreur inattendue s'est produite.");
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
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group bg-white/5 py-1.5 px-3 rounded-lg border border-white/5 hover:border-primary/50 transition-all no-underline"
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
          max-width: 820px;
          margin: 2rem auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.75rem 2rem 1rem;
          border-bottom: 1px solid var(--input-border);
        }
        .form-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 0.25rem;
          color: var(--foreground);
        }
        .form-subtitle {
          margin: 0;
          font-size: 0.9rem;
          color: #64748b;
        }
        .progress-badge {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.4rem 1rem;
          border-radius: 999px;
        }
        .progress-bar-track {
          height: 4px;
          background: var(--input-border);
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stepper {
          display: flex;
          padding: 1.25rem 2rem;
          gap: 0;
          border-bottom: 1px solid var(--input-border);
          overflow-x: auto;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          flex: 1;
          cursor: default;
          min-width: 60px;
          opacity: 0.45;
          transition: opacity 0.2s;
        }
        .step-item.done { opacity: 0.7; cursor: pointer; }
        .step-item.active { opacity: 1; }
        .step-item.done:hover { opacity: 0.9; }
        .step-dot {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--input-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.2s;
          border: 2px solid transparent;
        }
        .step-item.active .step-dot {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.2);
        }
        .step-item.done .step-dot {
          background: rgba(16,185,129,0.15);
          border-color: var(--secondary);
          color: var(--secondary);
          font-weight: 700;
        }
        .step-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--foreground);
          white-space: nowrap;
        }
        .step-item.active .step-label {
          color: var(--primary);
          font-weight: 700;
        }
        .form-body {
          padding: 2rem;
          min-height: 380px;
        }
        .form-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          border-top: 1px solid var(--input-border);
          background: rgba(0,0,0,0.01);
        }
      `}</style>
        </div>
    );
}
