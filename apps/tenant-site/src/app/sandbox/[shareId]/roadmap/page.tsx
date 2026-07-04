import { createSandboxPageRoute } from "@/lib/sandbox-page";

const route = createSandboxPageRoute("roadmap");

export const generateMetadata = route.generateMetadata;
export default route.Page;
