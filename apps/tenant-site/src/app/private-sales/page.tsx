import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("private-sales");

export const generateMetadata = route.generateMetadata;
export default route.Page;
