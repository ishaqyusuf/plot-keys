import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("testimonials");

export const generateMetadata = route.generateMetadata;
export default route.Page;
