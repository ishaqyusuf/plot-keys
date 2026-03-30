import { redirect } from "next/navigation";

export default function LegacySavedRedirectPage() {
  redirect("/portal/saved");
}
