import { Label } from "@plotkeys/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";

type Props = {
  businessType: string;
  onBusinessTypeChange: (value: string) => void;
  onPrimaryGoalChange: (value: string) => void;
  onStylePreferenceChange: (value: string) => void;
  onToneChange: (value: string) => void;
  primaryGoal: string;
  stylePreference: string;
  tone: string;
};

export function RecommendTemplateFields({
  businessType,
  onBusinessTypeChange,
  onPrimaryGoalChange,
  onStylePreferenceChange,
  onToneChange,
  primaryGoal,
  stylePreference,
  tone,
}: Props) {
  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="rtp-business-type">Business type</Label>
        <Select onValueChange={onBusinessTypeChange} value={businessType}>
          <SelectTrigger id="rtp-business-type">
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="luxury">Luxury</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="residential-sales">
              Residential (Sales)
            </SelectItem>
            <SelectItem value="residential-rentals">
              Residential (Rentals)
            </SelectItem>
            <SelectItem value="mixed">Mixed / General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rtp-primary-goal">Primary goal</Label>
        <Select onValueChange={onPrimaryGoalChange} value={primaryGoal}>
          <SelectTrigger id="rtp-primary-goal">
            <SelectValue placeholder="Select primary goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="generate-leads">Generate leads</SelectItem>
            <SelectItem value="showcase-listings">Showcase listings</SelectItem>
            <SelectItem value="build-brand">Build brand</SelectItem>
            <SelectItem value="all-of-above">All of the above</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rtp-style">Style preference</Label>
        <Select onValueChange={onStylePreferenceChange} value={stylePreference}>
          <SelectTrigger id="rtp-style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimal">Minimal / Editorial</SelectItem>
            <SelectItem value="bold">Bold / Dynamic</SelectItem>
            <SelectItem value="classic">Classic / Warm</SelectItem>
            <SelectItem value="modern">Modern / Clean</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rtp-tone">Tone</Label>
        <Select onValueChange={onToneChange} value={tone}>
          <SelectTrigger id="rtp-tone">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="luxury">Luxury</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
