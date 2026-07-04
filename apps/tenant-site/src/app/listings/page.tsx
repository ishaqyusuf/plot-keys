import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("listings");

export const generateMetadata = route.generateMetadata;
export default route.Page;
