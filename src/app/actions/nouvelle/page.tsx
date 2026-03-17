import { getEntreprises } from "@/app/actions/crm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import FormSuiviAction from "./FormSuiviAction";
import Link from "next/link";

export default async function NouvelleActionPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const { data: entreprises } = await getEntreprises();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-10 pb-6 border-b border-white/5">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white tracking-tight">Nouveau Suivi d&apos;Action</h1>
                    <p className="text-slate-400 text-[11px] uppercase tracking-[0.2em] font-bold opacity-60">
                        Renseignez les détails de votre intervention commerciale
                    </p>
                </div>
                
                <Link 
                    href="/entreprises" 
                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all group shrink-0 mt-1"
                    title="Retour vers la paage du menu entreprise"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-0.5 transition-transform">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </Link>
            </div>

            <FormSuiviAction entreprises={entreprises || []} />
        </div>
    );
}
