import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("privacy");

export const generateMetadata = route.generateMetadata;
export default route.Page;
