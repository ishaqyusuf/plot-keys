import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("portfolio");

export const generateMetadata = route.generateMetadata;
export default route.Page;
