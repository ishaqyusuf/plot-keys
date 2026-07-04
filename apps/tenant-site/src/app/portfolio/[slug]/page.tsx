import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("portfolio-detail");

export const generateMetadata = route.generateMetadata;
export default route.Page;
