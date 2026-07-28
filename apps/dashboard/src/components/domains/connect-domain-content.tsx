import { isVercelDomainProvisioningConfigured } from "@plotkeys/utils";

import { ConnectDomainView } from "./connect-domain-view";

export function ConnectDomainContent() {
  return (
    <ConnectDomainView vercelReady={isVercelDomainProvisioningConfigured()} />
  );
}
