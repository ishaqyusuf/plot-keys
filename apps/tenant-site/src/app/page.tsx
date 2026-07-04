import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("home");

export const generateMetadata = route.generateMetadata;
export default route.Page;
