export const propertyTableColumns = [
  { id: "property", label: "Property" },
  { id: "type", label: "Type" },
  { id: "status", label: "Status" },
  { id: "price", label: "Price" },
  { id: "details", label: "Details" },
  { id: "actions", label: "Actions" },
] as const;

export type PropertyTableRow = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  location: string | null;
  price: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  specs: string | null;
  type: string | null;
  subType: string | null;
  status: string;
  publishState: string;
  featured: boolean;
};
