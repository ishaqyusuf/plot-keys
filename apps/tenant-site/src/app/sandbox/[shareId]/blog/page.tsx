import { createSandboxPageRoute } from "@/lib/sandbox-page";

const route = createSandboxPageRoute("blog");

export const generateMetadata = route.generateMetadata;
export default route.Page;
