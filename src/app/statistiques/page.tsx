import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStatisticsData } from "../actions/statistics";
import StatisticsClient from "./StatisticsClient";
import ExportButtons from "./ExportButtons";

export const dynamic = "force-dynamic";

export default async function StatistiquesPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const res = await getStatisticsData();
    const data = res.success ? res.data : null;

    if (!data) {
        return (
            <main className="page-wrapper min-h-screen flex items-center justify-center">
                <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <p className="text-red-500 font-bold">Erreur de chargement des statistiques</p>
                </div>
            </main>
        );
    }

    return (
        <main className="page-wrapper min-h-screen space-y-8 pb-20">
            {/* -- HEADER -- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-2">
                        Statistiques & Analyses
                    </h1>
                    <div className="flex items-center gap-2 text-muted font-medium text-xs sm:text-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Vue d'ensemble et interprétation des données terrain
                    </div>
                </div>
                <div className="w-full md:w-auto mt-4 md:mt-0">
                    <ExportButtons data={data} />
                </div>
            </div>

            {/* -- DASHBOARD CONTENT -- */}
            <StatisticsClient data={data} />
            
        </main>
    );
}
