import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("contact");

export const generateMetadata = route.generateMetadata;
export default route.Page;
