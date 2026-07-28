import { AgentsColumnVisibility } from "@/components/agents-column-visibility";
import { OpenAgentSheet } from "@/components/open-agent-sheet";
import { OpenInviteAgentSheet } from "@/components/open-invite-agent-sheet";
import { SearchField } from "@/components/search-field";

type Props = {
  canManage: boolean;
};

export function AgentsHeader({ canManage }: Props) {
  return (
    <div className="flex items-center justify-between">
      <SearchField placeholder="Search agents" />

      <div className="flex items-center gap-2">
        <AgentsColumnVisibility />
        {canManage ? (
          <>
            <div className="hidden sm:block">
              <OpenInviteAgentSheet />
            </div>
            <div className="hidden sm:block">
              <OpenAgentSheet />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
