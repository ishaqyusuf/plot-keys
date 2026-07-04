import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("investors");

export const generateMetadata = route.generateMetadata;
export default route.Page;
