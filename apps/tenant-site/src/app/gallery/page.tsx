import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("gallery");

export const generateMetadata = route.generateMetadata;
export default route.Page;
