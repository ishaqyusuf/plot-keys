import { Alert, AlertDescription } from "@plotkeys/ui/alert";

type Props = {
  message?: string;
};

export function RecommendTemplateError({ message }: Props) {
  return (
    <Alert variant="destructive">
      <AlertDescription>{message ?? "Something went wrong."}</AlertDescription>
    </Alert>
  );
}
