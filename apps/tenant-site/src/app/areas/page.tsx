import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("areas");

export const generateMetadata = route.generateMetadata;
export default route.Page;
