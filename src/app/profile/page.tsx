import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    const user = await db.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) redirect("/login");

    const allUsers = await db.user.findMany({
        orderBy: { date_creation: 'desc' },
        select: { id: true, nom: true, prenom: true, email: true, role: true, zone: true, date_creation: true }
    });

    // Action serveur pour créer un utilisateur (Accessible uniquement aux Admins/Managers)
    async function createUser(formData: FormData) {
        "use server";

        const currentUser = await auth();
        // Basic role check
        if (!["Administrateur", "Manager", "Directeur commercial"].includes(currentUser?.user?.role as string)) {
            throw new Error("Non autorisé à créer des utilisateurs.");
        }

        const nom = formData.get("nom") as string;
        const prenom = formData.get("prenom") as string;
        const email = formData.get("email") as string;
        const role = formData.get("role") as string;
        const zone = formData.get("zone") as string;
        const password = formData.get("password") as string;

        if (!nom || !prenom || !email || !role || !password) {
            throw new Error("Veuillez remplir tous les champs obligatoires.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            await db.user.create({
                data: {
                    nom,
                    prenom,
                    email,
                    role,
                    zone: zone || null,
                    password_hash: hashedPassword,
                }
            });
            revalidatePath("/profile");
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error("Cet email est déjà utilisé.");
            }
            throw new Error("Erreur lors de la création de l'utilisateur.");
        }
    }

    const canCreateUser = ["Administrateur", "Manager", "Directeur commercial"].includes(user.role);

    // Action serveur pour changer son propre mot de passe
    async function changePassword(formData: FormData) {
        "use server";
        const session = await auth();
        if (!session?.user?.email) throw new Error("Non authentifié.");

        const currentPassword = formData.get("current_password") as string;
        const newPassword = formData.get("new_password") as string;
        const confirmPassword = formData.get("confirm_password") as string;

        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new Error("Tous les champs sont requis.");
        }
        if (newPassword !== confirmPassword) {
            throw new Error("Les nouveaux mots de passe ne correspondent pas.");
        }
        if (newPassword.length < 8) {
            throw new Error("Le nouveau mot de passe doit contenir au moins 8 caractères.");
        }

        const dbUser = await db.user.findUnique({ where: { email: session.user.email } });
        if (!dbUser || !dbUser.password_hash) throw new Error("Utilisateur introuvable.");

        const isValid = await bcrypt.compare(currentPassword, dbUser.password_hash);
        if (!isValid) throw new Error("Mot de passe actuel incorrect.");

        const hashedNew = await bcrypt.hash(newPassword, 10);
        await db.user.update({
            where: { email: session.user.email },
            data: { password_hash: hashedNew },
        });
        revalidatePath("/profile");
    }

    return (
        <main className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto space-y-6 sm:space-y-8">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">Mon Profil</h1>
                    <p className="text-muted font-medium text-sm sm:text-base">Gérez vos informations et les accès du personnel.</p>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="lg:col-span-1">
                    <div className="premium-panel p-6 sm:p-8 text-center items-center flex flex-col relative overflow-hidden h-full">

                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 p-1 mb-6 shadow-xl shadow-primary/20">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl font-black text-primary relative z-10">
                                {user.prenom[0]}{user.nom[0]}
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-foreground">{user.prenom} {user.nom}</h2>
                        <p className="text-primary font-bold tracking-widest uppercase text-xs mt-1 mb-6">{user.role}</p>

                        <div className="w-full space-y-4 text-left">
                            <div className="p-4 rounded-xl bg-surface-2 border border-border">
                                <span className="text-xs font-bold text-muted uppercase block mb-1">Email professionnel</span>
                                <span className="text-sm font-medium text-foreground">{user.email}</span>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-2 border border-border">
                                <span className="text-xs font-bold text-muted uppercase block mb-1">Zone affectée</span>
                                <span className="text-sm font-medium text-foreground">{user.zone || "National"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Management */}
                <div className="lg:col-span-2 h-full">
                    {canCreateUser ? (
                        <div className="premium-panel p-5 sm:p-8 h-full">
                            <h3 className="text-lg sm:text-xl font-black text-foreground mb-6 flex items-center gap-3 uppercase tracking-tight">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                                Collaborateur
                            </h3>

                            <form action={createUser} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="form-group mb-0">
                                    <label className="form-label">Prénom</label>
                                    <input type="text" name="prenom" required className="form-input" placeholder="Ex: Jean" />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label">Nom</label>
                                    <input type="text" name="nom" required className="form-input" placeholder="Ex: Dupont" />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label">Email</label>
                                    <input type="email" name="email" required className="form-input" placeholder="jean.dupont@mist.com" />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label">Mot de passe provisoire</label>
                                    <input type="password" name="password" required className="form-input" placeholder="••••••••" minLength={6} />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label">Rôle d'accès</label>
                                    <select name="role" required className="form-select">
                                        <option value="Commercial">Commercial (Terrain)</option>
                                        <option value="Manager">Manager de Zone</option>
                                        <option value="Directeur commercial">Directeur Commercial</option>
                                        <option value="Administrateur">Administrateur Système</option>
                                    </select>
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label">Zone de couverture (Optionnel)</label>
                                    <input type="text" name="zone" className="form-input" placeholder="Ex: Nord, Sud, Abidjan..." />
                                </div>
                                <div className="md:col-span-2 pt-2 flex justify-center sm:justify-end">
                                    <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95">
                                        Créer l&apos;accès
                                    </button>
                                </div>

                            </form>
                        </div>
                    ) : (
                        <div className="premium-panel p-8 h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-surface-2 border border-border flex items-center justify-center text-muted mb-4 text-2xl">🔒</div>
                            <h3 className="text-lg font-bold text-foreground mb-2">Gestion d'équipe restreinte</h3>
                            <p className="text-sm text-muted max-w-xs">Seuls les administrateurs et managers peuvent ajouter de nouveaux collaborateurs.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Full Width Records Table */}
            {["Administrateur", "Directeur commercial"].includes(user.role) && (
                <div className="premium-panel overflow-hidden border border-border">
                    <div className="p-6 border-b border-border flex items-center justify-between bg-surface-2">
                        <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Personnel</h3>
                        <span className="text-xs font-bold text-muted uppercase tracking-widest bg-white border border-border px-3 py-1 rounded-lg">{allUsers.length}</span>
                    </div>
                    <div className="table-scroll-wrapper">

                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-surface-3/50 border-b border-border">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted">Utilisateur</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted">Rôle</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted">Zone</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted text-right">Inscrit le</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {allUsers.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-surface-2 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-surface-3 border border-border flex items-center justify-center text-xs font-bold text-muted">
                                                    {u.prenom[0]}{u.nom[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground">{u.prenom} {u.nom}</div>
                                                    <div className="text-xs text-muted">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-widest border ${u.role === 'Administrateur' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                u.role === 'Commercial' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-muted">{u.zone || "—"}</td>
                                        <td className="px-6 py-4 text-right text-xs text-muted tabular-nums">
                                            {new Date(u.date_creation).toLocaleDateString("fr-FR")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Change Password Section */}
            <div className="premium-panel p-5 sm:p-8">
                <h3 className="text-lg sm:text-xl font-black text-foreground mb-6 flex items-center gap-3 uppercase tracking-tight">

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    Changer mon mot de passe
                </h3>
                <form action={changePassword} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="form-group mb-0">
                        <label className="form-label">Mot de passe actuel</label>
                        <input type="password" name="current_password" required className="form-input" placeholder="••••••••" />
                    </div>
                    <div className="form-group mb-0">
                        <label className="form-label">Nouveau mot de passe</label>
                        <input type="password" name="new_password" required className="form-input" placeholder="Min. 8 caractères" minLength={8} />
                    </div>
                    <div className="form-group mb-0">
                        <label className="form-label">Confirmer le nouveau mot de passe</label>
                        <input type="password" name="confirm_password" required className="form-input" placeholder="••••••••" minLength={8} />
                    </div>
                    <div className="md:col-span-3 flex justify-center sm:justify-end pt-2">
                        <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
                            Mettre à jour
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}
