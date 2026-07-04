import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("careers");

export const generateMetadata = route.generateMetadata;
export default route.Page;
