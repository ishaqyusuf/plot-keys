import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("listing-detail");

export const generateMetadata = route.generateMetadata;
export default route.Page;
