import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("rentals");

export const generateMetadata = route.generateMetadata;
export default route.Page;
