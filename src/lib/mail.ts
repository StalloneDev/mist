/**
 * Utilitaire pour l'envoi d'emails via SMTP (Nodemailer)
 * Configuration via variables d'environnement dans .env
 */
import nodemailer from "nodemailer";

// ─── Création du transporteur SMTP ───────────────────────────────────────────
function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true", // true pour 465, false pour 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

// ─── Template HTML : Résumé d'Action ─────────────────────────────────────────
function buildActionMailHtml(action: any): string {
    const date = new Date(action.date_action).toLocaleDateString("fr-FR", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    const prioriteColor =
        action.priorite === "Haute" ? "#ef4444" :
        action.priorite === "Moyenne" ? "#f97316" :
        "#3b82f6";

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Résumé d'Action Commerciale</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#1e293b;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#1e3a8a,#7c3aed);padding:40px 40px 30px;text-align:center;">
                            <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">MIST</div>
                            <div style="font-size:11px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:3px;margin-top:4px;">Intelligence System</div>
                            <div style="margin-top:20px;font-size:18px;font-weight:700;color:#ffffff;">Résumé d'Action Commerciale</div>
                        </td>
                    </tr>
                    
                    <!-- Meta Infos -->
                    <tr>
                        <td style="padding:30px 40px 20px;">
                            <table width="100%">
                                <tr>
                                    <td>
                                        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px;">Entreprise</div>
                                        <div style="font-size:22px;font-weight:800;color:#ffffff;">${action.entreprise?.raison_sociale || "N/A"}</div>
                                    </td>
                                    <td align="right" style="vertical-align:top;">
                                        <div style="display:inline-block;background-color:${prioriteColor}1A;border:1px solid ${prioriteColor}33;border-radius:20px;padding:6px 16px;font-size:11px;font-weight:800;color:${prioriteColor};text-transform:uppercase;letter-spacing:1px;">
                                            ${action.priorite || "N/A"}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div style="margin-top:8px;font-size:13px;color:#64748b;">
                                ${action.type_action} &nbsp;•&nbsp; ${date}
                                ${action.heure_debut ? `&nbsp;•&nbsp; ${action.heure_debut}${action.heure_fin ? ` - ${action.heure_fin}` : ""}` : ""}
                            </div>
                        </td>
                    </tr>

                    <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);"></td></tr>

                    <!-- Sujet & Discussion -->
                    <tr>
                        <td style="padding:20px 40px;">
                            <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px;">Sujet Principal</div>
                            <div style="font-size:15px;font-weight:700;color:#e2e8f0;">${action.sujet_principal || "Non précisé"}</div>
                        </td>
                    </tr>
                    ${action.personne_contactee ? `
                    <tr>
                        <td style="padding:0 40px 20px;">
                            <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px;">Personne Contactée</div>
                            <div style="font-size:14px;color:#94a3b8;">${action.personne_contactee}</div>
                        </td>
                    </tr>` : ""}
                    ${action.resume_discussion ? `
                    <tr>
                        <td style="padding:0 40px 20px;">
                            <div style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;">
                                <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:10px;">Résumé des Échanges</div>
                                <div style="font-size:14px;color:#94a3b8;line-height:1.7;">${action.resume_discussion}</div>
                            </div>
                        </td>
                    </tr>` : ""}

                    <!-- Prochaine Étape -->
                    ${action.prochaine_etape ? `
                    <tr>
                        <td style="padding:0 40px 30px;">
                            <div style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1));border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:20px;">
                                <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#818cf8;margin-bottom:8px;">Prochaine Étape Prévue</div>
                                <div style="font-size:16px;font-weight:800;color:#c7d2fe;">${action.prochaine_etape}</div>
                                ${action.date_prochaine_action ? `
                                <div style="margin-top:8px;font-size:13px;color:#64748b;">
                                    📅 Prévue le ${new Date(action.date_prochaine_action).toLocaleDateString("fr-FR", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
                                </div>` : ""}
                            </div>
                        </td>
                    </tr>` : ""}

                    <!-- Statuts Obtenus -->
                    ${action.statut_obtenu ? `
                    <tr>
                        <td style="padding:0 40px 30px;">
                            <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:10px;">Statuts Obtenus</div>
                            <div style="font-size:13px;color:#94a3b8;">${action.statut_obtenu}</div>
                        </td>
                    </tr>` : ""}

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:rgba(0,0,0,0.2);padding:24px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                            <div style="font-size:11px;color:#475569;">
                                Email généré automatiquement par <strong style="color:#6366f1;">MIST CRM</strong><br>
                                Ce rapport a été envoyé suite à l'enregistrement d'une action commerciale.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// ─── Template HTML : Email de Rappel ─────────────────────────────────────────
function buildReminderMailHtml(action: any): string {
    const date = new Date(action.date_prochaine_action).toLocaleDateString("fr-FR", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#1e293b;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
                    <tr>
                        <td style="background:linear-gradient(135deg,#dc2626,#9333ea);padding:40px;text-align:center;">
                            <div style="font-size:32px;margin-bottom:16px;">🔔</div>
                            <div style="font-size:20px;font-weight:800;color:#ffffff;">Rappel d'Action Commerciale</div>
                            <div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:8px;">Votre prochaine intervention est prévue pour <strong>demain</strong></div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px;">
                            <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px;">Entreprise</div>
                            <div style="font-size:20px;font-weight:800;color:#ffffff;margin-bottom:16px;">${action.entreprise?.raison_sociale || "N/A"}</div>
                            <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px;">Action Prévue</div>
                            <div style="font-size:16px;font-weight:700;color:#e2e8f0;margin-bottom:8px;">${action.prochaine_etape}</div>
                            <div style="font-size:13px;color:#64748b;">📅 ${date}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:rgba(0,0,0,0.2);padding:24px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                            <div style="font-size:11px;color:#475569;">Email de rappel automatique par <strong style="color:#6366f1;">MIST CRM</strong></div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// ─── Fonction principale : Envoi du résumé d'action ──────────────────────────
export async function sendActionMail(actionData: any, userMail: string) {
    // Guard : si les variables SMTP ne sont pas configurées, on log et on skip
    if (!process.env.SMTP_USER || process.env.SMTP_USER === "votre-email@gmail.com") {
        console.warn("[MAIL] SMTP non configuré. L'email n'a pas été envoyé.");
        console.log(`[MAIL MOCK] À : ${userMail} | Sujet : Résumé Action - ${actionData?.entreprise?.raison_sociale}`);
        return { success: false, reason: "SMTP non configuré" };
    }

    try {
        const transporter = createTransporter();
        await transporter.verify();

        const recipients = [userMail];
        if (process.env.SMTP_ADMIN_EMAIL && process.env.SMTP_ADMIN_EMAIL !== "") {
            recipients.push(process.env.SMTP_ADMIN_EMAIL);
        }

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"MIST CRM" <${process.env.SMTP_USER}>`,
            to: recipients.join(", "),
            subject: `✅ Rapport Action — ${actionData?.entreprise?.raison_sociale || "Client"} | ${actionData?.type_action}`,
            html: buildActionMailHtml(actionData),
        });

        console.log(`[MAIL] Envoyé avec succès à ${userMail} — MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("[MAIL] Erreur lors de l'envoi :", error.message);
        return { success: false, error: error.message };
    }
}

// ─── Fonction de rappel : J-1 avant la prochaine action ──────────────────────
export async function scheduleReminderMail(actionData: any, userMail: string) {
    if (!actionData?.date_prochaine_action) return;

    // Guard : si les variables SMTP ne sont pas configurées, on log et on skip
    if (!process.env.SMTP_USER || process.env.SMTP_USER === "votre-email@gmail.com") {
        const reminderDate = new Date(actionData.date_prochaine_action);
        reminderDate.setDate(reminderDate.getDate() - 1);
        console.warn(`[MAIL MOCK] Rappel prévu pour le ${reminderDate.toLocaleDateString("fr-FR")} à ${userMail}`);
        return { success: false, reason: "SMTP non configuré" };
    }

    // Dans un vrai système de production, un job (cron / queue) enverrait ce mail le lendemain.
    // Pour l'instant on envoie le rappel immédiatement à titre de test.
    try {
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"MIST CRM" <${process.env.SMTP_USER}>`,
            to: userMail,
            subject: `🔔 Rappel : ${actionData.prochaine_etape} — ${actionData?.entreprise?.raison_sociale || "Client"}`,
            html: buildReminderMailHtml(actionData),
        });

        console.log(`[MAIL] Rappel envoyé à ${userMail} — MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("[MAIL] Erreur lors de l'envoi du rappel :", error.message);
        return { success: false, error: error.message };
    }
}
