import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("faq");

export const generateMetadata = route.generateMetadata;
export default route.Page;
