import { createTenantPageRoute } from "@/lib/tenant-page";

const route = createTenantPageRoute("blog-post");

export const generateMetadata = route.generateMetadata;
export default route.Page;
