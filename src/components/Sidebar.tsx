import { auth } from "@/lib/auth";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
    const session = await auth();

    // Server component pass la session au client component (qui a les hooks usePathname etc)
    return <SidebarClient session={session} />;
}
