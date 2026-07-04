import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("projects");

export const generateMetadata = route.generateMetadata;
export default route.Page;
