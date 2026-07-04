import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("landlords");

export const generateMetadata = route.generateMetadata;
export default route.Page;
