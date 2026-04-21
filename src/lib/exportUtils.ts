import * as XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// ─── Excel column headers matching the Reporting import template ───
const REPORTING_HEADERS: Record<string, string> = {
    excel_id: "ID",
    date_visite: "Date Visite",
    commercial: "Commercial",
    type_collecte: "Type Collecte",
    raison_sociale: "Raison Sociale",
    secteur: "Secteur",
    secteur_autre: "Secteur Autre",
    localisation: "Localisation",
    contact_nom: "Nom Contact",
    contact_fonction: "Fonction Contact",
    contact_tel: "Tél. Contact",
    activite: "Activité",
    activite_autre: "Activité Autre",
    description: "Description Projet",
    debut: "Début",
    fin_estimee: "Fin Estimée",
    statut_projet: "Statut Projet",
    periode_projet: "Période Projet",
    taille_projet: "Taille Projet",
    equipements: "Équipements",
    nb_equip: "Nb. Équip.",
    heures_jour: "Heures/Jour",
    produit: "Produit",
    produit_autre: "Produit Autre",
    conso_jour: "Conso/Jour (L)",
    conso_semaine: "Conso/Semaine (L)",
    conso_mois: "Conso/Mois (L)",
    conso_mensuelle_estime: "Estimation Mensuelle (L)",
    mode_appro: "Mode Approvisionnement",
    fournisseur_principal: "Fournisseur Principal",
    fournisseur_secondaire: "Fournisseur Secondaire",
    type_relation: "Type Relation",
    satisfaction: "Satisfaction",
    opportunite_niveau: "Niveau Opportunité",
    decideur_identifie: "Décideur Identifié",
    decideur_nom: "Nom Décideur",
    fenetre_entree: "Fenêtre Entrée",
    observations: "Observations",
    actions: "Actions Prévues",
    volume_potentiel_dir: "Volume DIR (L)",
    priorite: "Priorité",
    volume_potentiel: "Volume Potentiel (L)",
    mois_visite: "Mois Visite",
};

/**
 * Exports an array of reporting rows to an Excel file.
 */
export function exportReportingToExcel(rows: any[], filename = "Reporting_MIST.xlsx") {
    const exportableKeys = Object.keys(REPORTING_HEADERS);

    // Build worksheet data
    const wsData: any[][] = [];
    // Header row
    wsData.push(exportableKeys.map(k => REPORTING_HEADERS[k]));
    // Data rows
    rows.forEach(row => {
        wsData.push(exportableKeys.map(k => {
            const val = row[k];
            if (val === null || val === undefined) return "";
            return val;
        }));
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Styling Headers
    for (let c = 0; c < exportableKeys.length; c++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c });
        if (ws[cellRef]) {
            ws[cellRef].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "3B82F6" } }, // blue header
                alignment: { horizontal: "center" }
            };
        }
    }

    // Auto-width columns
    const colWidths = wsData[0].map((_: any, i: number) => ({
        wch: Math.max(
            wsData[0][i]?.toString().length || 10,
            ...wsData.slice(1).map(r => r[i]?.toString().length || 0)
        ) + 2
    }));
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporting");
    XLSX.writeFile(wb, filename);
}

/**
 * Exports sector detail data to an Excel file with styling.
 */
export function exportSectorToExcel(sectorName: string, rows: any[]) {
    const keys = ["raison_sociale", "localisation", "commercial", "opportunite_niveau", "volume_potentiel", "volume_potentiel_dir", "conso_mensuelle_estime"];
    const headers = ["Raison Sociale", "Localisation", "Commercial", "Niveau Opportunité", "Vol. Potentiel (L)", "Vol. DIR (L)", "Conso. Mensuelle (L)"];

    const wsData: any[][] = [headers, ...rows.map(r => keys.map(k => r[k] ?? ""))];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Styling Headers
    for (let c = 0; c < headers.length; c++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c });
        if (ws[cellRef]) {
            ws[cellRef].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "10B981" } } // emerald header for dashboard
            };
        }
    }

    ws["!cols"] = headers.map((h, i) => ({
        wch: Math.max(h.length, ...wsData.slice(1).map(r => String(r[i] || "").length)) + 2
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sectorName.substring(0, 30));
    XLSX.writeFile(wb, `Analyse_${sectorName.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`);
}

/**
 * Triggers PDF export via jsPDF instead of window.print() for reliable rendering
 */
export function exportReportingToPdf(rows: any[], filename = "Reporting_MIST.pdf") {
    // Crée une page très large pour accueillir plus de 30 colonnes
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [3000, 1500] 
    });
    
    // Select ALL meaningful columns
    const keys = Object.keys(REPORTING_HEADERS);
    const headers = Object.values(REPORTING_HEADERS);

    const body = rows.map(r => keys.map(k => {
        let val = r[k];
        if (val === null || val === undefined) return "";
        if (k.includes("volume") && !isNaN(val) && val !== "") return Number(val).toLocaleString("fr-FR");
        return String(val);
    }));

    autoTable(doc, {
        head: [headers],
        body: body,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold', halign: 'center' },
        margin: { top: 40, left: 20, right: 20 },
        didDrawPage: function (data) {
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.text(`Reporting Terrain MIST - Total Enregistrements: ${rows.length}`, data.settings.margin.left, 25);
        }
    });

    doc.save(filename);
}


/**
 * Exports Statistics Data to a structured Excel file with multiple sheets
 */
export function exportStatisticsToExcel(statsData: any) {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Résumé & Top Clients
    const summaryData = [
        ["Indicateur", "Valeur"],
        ["Volume Potentiel Global (L)", statsData.summary.totalVolume],
        ["Conso. Mensuelle Estimée (L)", statsData.summary.totalConso],
        ["Opportunités Fortes", statsData.summary.totalOpportunites],
        ["Secteurs Actifs", statsData.summary.activeSectors],
        ["Total Enregistrements", statsData.summary.totalRecords],
        [],
        ["Top Compte", "Secteur", "Commercial", "Volume Potentiel (L)"]
    ];
    statsData.topClients.forEach((c: any) => {
        summaryData.push([c.name, c.secteur, c.commercial, c.volume]);
    });

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Style headers for summary
    [XLSX.utils.encode_cell({c:0, r:0}), XLSX.utils.encode_cell({c:1, r:0})].forEach(ref => {
        if (wsSummary[ref]) wsSummary[ref].s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "3B82F6" } } };
    });
    [0,1,2,3].forEach(c => {
        const ref = XLSX.utils.encode_cell({c, r:7});
        if (wsSummary[ref]) wsSummary[ref].s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "10B981" } } };
    });
    wsSummary["!cols"] = [{wch: 35}, {wch: 25}, {wch: 25}, {wch: 20}];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Résumé et Top Clients");

    // Sheet 2: Répartition Sectorielle
    const sectorData = [["Secteur", "Volume Potentiel (L)", "Nb. Entreprises", "Conso mensuelle (L)"]];
    statsData.sectorDistribution.forEach((s: any) => {
        sectorData.push([s.name, s.volume, s.count, s.conso]);
    });
    const wsSector = XLSX.utils.aoa_to_sheet(sectorData);
    [0,1,2,3].forEach(c => {
        const ref = XLSX.utils.encode_cell({c, r:0});
        if (wsSector[ref]) wsSector[ref].s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "8B5CF6" } } };
    });
    wsSector["!cols"] = [{wch: 30}, {wch: 20}, {wch: 15}, {wch: 20}];
    XLSX.utils.book_append_sheet(wb, wsSector, "Analyse Sectorielle");

    // Sheet 3: Performance Commerciale
    const commData = [["Commercial", "Volume Potentiel (L)", "Visites", "Opportunités Fortes"]];
    statsData.commercialPerf.forEach((c: any) => {
        commData.push([c.name, c.volume, c.visites, c.opportunites]);
    });
    const wsComm = XLSX.utils.aoa_to_sheet(commData);
    [0,1,2,3].forEach(col => {
        const ref = XLSX.utils.encode_cell({c: col, r:0});
        if (wsComm[ref]) wsComm[ref].s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "F59E0B" } } };
    });
    wsComm["!cols"] = [{wch: 30}, {wch: 20}, {wch: 15}, {wch: 20}];
    XLSX.utils.book_append_sheet(wb, wsComm, "Performances Commerciaux");

    XLSX.writeFile(wb, "Analyses_Statistiques_MIST.xlsx");
}

/**
 * Exports Statistics Data to a multi-page PDF Report
 */
export function exportStatisticsToPdf(statsData: any) {
    const doc = new jsPDF('portrait');
    
    // Page 1: Titre et Résumé
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text("Rapport Analytique MIST", 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 20, 40);

    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246); // Primary blue
    doc.text("1. Indicateurs Clés", 20, 60);

    const kpiBody = [
        ["Volume Potentiel Global", Number(statsData.summary.totalVolume).toLocaleString("fr-FR") + " L"],
        ["Conso. Mensuelle Estimée", Number(statsData.summary.totalConso).toLocaleString("fr-FR") + " L"],
        ["Opportunités Fortes", String(statsData.summary.totalOpportunites)],
        ["Secteurs Actifs", String(statsData.summary.activeSectors)]
    ];

    autoTable(doc, {
        startY: 65,
        head: [["Indicateur", "Valeur"]],
        body: kpiBody,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 120;

    doc.setFontSize(14);
    doc.text("2. Top 10 Comptes Stratégiques", 20, finalY + 15);

    const clientsBody = statsData.topClients.map((c: any, i: number) => [
        `#${i+1}`, c.name, c.secteur, c.commercial, Number(c.volume).toLocaleString("fr-FR") + " L"
    ]);

    autoTable(doc, {
        startY: finalY + 20,
        head: [["Rang", "Raison Sociale", "Secteur", "Commercial", "Volume (L)"]],
        body: clientsBody,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }, // Emerald
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 }
    });

    // Page 2: Secteurs et Commerciaux
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text("3. Répartition Sectorielle par Volume", 20, 30);

    const sectorBody = statsData.sectorDistribution.map((s: any) => [
        s.name, Number(s.volume).toLocaleString("fr-FR") + " L", s.count
    ]);

    autoTable(doc, {
        startY: 35,
        head: [["Secteur", "Volume Potentiel (L)", "Nb. de Comptes"]],
        body: sectorBody,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] }, // Purple
        margin: { left: 20, right: 20 }
    });

    const finalYPage2 = (doc as any).lastAutoTable.finalY || 60;

    doc.setFontSize(14);
    doc.text("4. Performances Commerciaux", 20, finalYPage2 + 15);

    const commBody = statsData.commercialPerf.map((c: any) => [
        c.name, Number(c.volume).toLocaleString("fr-FR") + " L", c.visites, c.opportunites
    ]);

    autoTable(doc, {
        startY: finalYPage2 + 20,
        head: [["Commercial", "Volume Potentiel (L)", "Visites", "Opportunités Fortes"]],
        body: commBody,
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11] }, // Amber
        margin: { left: 20, right: 20 }
    });

    doc.save("Analyses_Statistiques_MIST.pdf");
}
