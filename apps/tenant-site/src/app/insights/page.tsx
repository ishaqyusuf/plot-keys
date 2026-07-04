import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("insights");

export const generateMetadata = route.generateMetadata;
export default route.Page;
