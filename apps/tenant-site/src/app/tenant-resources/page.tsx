import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("tenant-resources");

export const generateMetadata = route.generateMetadata;
export default route.Page;
