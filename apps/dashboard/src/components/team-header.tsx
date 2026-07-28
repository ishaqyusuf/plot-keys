import { SearchField } from "@/components/search-field";
import { TeamInviteAction } from "@/components/team-invite-action";
import { TeamMembersColumnVisibility } from "@/components/team-members-column-visibility";

type Props = {
  canInvite: boolean;
};

export function TeamHeader({ canInvite }: Props) {
  return (
    <div className="flex items-center justify-between">
      <SearchField placeholder="Search members" />

      <div className="flex items-center gap-2">
        <TeamMembersColumnVisibility />
        <div className="hidden sm:block">
          <TeamInviteAction canInvite={canInvite} />
        </div>
      </div>
    </div>
  );
}
