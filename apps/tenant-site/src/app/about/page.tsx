import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("about");

export const generateMetadata = route.generateMetadata;
export default route.Page;
