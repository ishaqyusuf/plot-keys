import { createSandboxPageRoute } from "@/lib/sandbox-page";

const route = createSandboxPageRoute("contact");

export const generateMetadata = route.generateMetadata;
export default route.Page;
