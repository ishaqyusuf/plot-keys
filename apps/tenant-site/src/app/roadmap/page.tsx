import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("roadmap");

export const generateMetadata = route.generateMetadata;
export default route.Page;
