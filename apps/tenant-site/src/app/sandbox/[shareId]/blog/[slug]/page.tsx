import { createSandboxPageRoute } from "@/lib/sandbox-page";

const route = createSandboxPageRoute("blog-post");

export const generateMetadata = route.generateMetadata;
export default route.Page;
