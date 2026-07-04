import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("project-detail");

export const generateMetadata = route.generateMetadata;
export default route.Page;
