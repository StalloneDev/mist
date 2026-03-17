import { getEntreprises, getStatutsEntreprise } from "@/app/actions/crm";
import { getSecteurs } from "@/app/actions/reference";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import EntrepriseListClient from "./EntrepriseListClient";
import SyncButton from "./SyncButton";

export default async function EntreprisesPage({ searchParams }: { searchParams: any }) {
    const session = await auth();
    if (!session) redirect("/login");

    const params = await searchParams;
    const { success, data: entreprises, error } = await getEntreprises({
        search: params.q,
    });
    const statuts = await getStatutsEntreprise();
    const secteurs = await getSecteurs();

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Gestion des Entreprises</h1>
                    <p className="text-slate-400 mt-1 text-sm uppercase tracking-widest font-bold opacity-70">
                        Prospects et Clients actifs du CRM
                    </p>
                </div>
                <div className="flex gap-4">
                    <SyncButton />
                    <Link 
                        href="/visites/nouvelle" 
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all font-bold"
                    >
                        + Ajouter via Visite
                    </Link>
                </div>
            </div>

            <EntrepriseListClient 
                initialEntreprises={entreprises || []} 
                statuts={statuts} 
                secteurs={secteurs}
            />
        </div>
    );
}
