"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { CompanyLogoUpload } from "./company-logo-upload";

type Props = {
  companyName: string;
  currentLogoUrl: string | null;
};

export function LogoUploadForm({ companyName, currentLogoUrl }: Props) {
  return (
    <Card>
      <div className="flex justify-between items-center pr-6">
        <CardHeader>
          <CardTitle>Company logo</CardTitle>
          <CardDescription>
            This is your company's logo. Click on the logo to upload a custom
            one from your files.
          </CardDescription>
        </CardHeader>

        <CompanyLogoUpload companyName={companyName} logoUrl={currentLogoUrl} />
      </div>

      <CardFooter>An avatar is optional but strongly recommended.</CardFooter>
    </Card>
  );
}
