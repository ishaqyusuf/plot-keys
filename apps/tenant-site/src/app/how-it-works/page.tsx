import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("how-it-works");

export const generateMetadata = route.generateMetadata;
export default route.Page;
