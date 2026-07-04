import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("blog");

export const generateMetadata = route.generateMetadata;
export default route.Page;
