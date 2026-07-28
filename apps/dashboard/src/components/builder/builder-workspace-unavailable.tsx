import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@plotkeys/ui/empty";

type Props = {
  description: string;
  title: string;
};

export function BuilderWorkspaceUnavailable({ description, title }: Props) {
  return (
    <Empty className="mx-auto max-w-3xl rounded-none border border-solid bg-background p-8 md:p-8">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
