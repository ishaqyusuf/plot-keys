import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("press");

export const generateMetadata = route.generateMetadata;
export default route.Page;
