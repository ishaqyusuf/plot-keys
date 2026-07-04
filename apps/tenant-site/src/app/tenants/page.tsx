import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("tenants");

export const generateMetadata = route.generateMetadata;
export default route.Page;
