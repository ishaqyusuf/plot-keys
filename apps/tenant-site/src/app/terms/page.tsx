import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("terms");

export const generateMetadata = route.generateMetadata;
export default route.Page;
