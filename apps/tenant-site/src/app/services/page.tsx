import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("services");

export const generateMetadata = route.generateMetadata;
export default route.Page;
