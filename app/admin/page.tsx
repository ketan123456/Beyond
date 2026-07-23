import { requireStaticAdmin } from "../static-admin-auth";
import AdminDashboard from "./admin-dashboard";
export const dynamic="force-dynamic";
export default async function Admin(){const user=await requireStaticAdmin();return <main className="admin-dashboard" data-no-translate><AdminDashboard adminName={user.displayName}/></main>}
