import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("rental-detail");

export const generateMetadata = route.generateMetadata;
export default route.Page;
