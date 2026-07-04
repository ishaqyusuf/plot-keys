import { createSandboxPageRoute } from "@/lib/sandbox-page";

const route = createSandboxPageRoute("home");

export const generateMetadata = route.generateMetadata;
export default route.Page;
