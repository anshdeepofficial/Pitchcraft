import { z } from "zod";

const str = () => z.string().default("");
const list = () => z.array(z.string()).default([]);

export const ProposalInputSchema = z.object({
  // Business
  businessName: z.string().min(1),
  websiteUrl: str(),
  detectedSiteNotes: str(),
  industries: list(),
  country: str(),
  currency: str(),
  timezone: str(),
  dateFormat: str(),

  // Business information
  address: str(),
  city: str(),
  state: str(),
  postalCode: str(),
  businessEmail: str(),
  businessPhone: str(),
  registrationNumber: str(),
  mapsUrl: str(),

  // Contact person
  contactName: str(),
  contactPosition: str(),
  contactPhone: str(),
  contactEmail: str(),
  preferredContact: str(),

  // Offering
  description: str(),
  targetAudience: list(),
  services: list(),
  products: list(),
  competitors: list(),
  goals: list(),

  // Growth
  seoGoals: list(),
  marketingGoals: list(),
  budget: str(),
  deadline: str(),
  pages: str(),
  languages: list(),

  // Design
  style: str(),
  brandPersonality: list(),
  colorMode: str(),
  colors: list(),
  fonts: str(),

  // Technical
  cms: str(),
  integrations: list(),
  specialRequirements: str(),
});

export type ProposalInput = z.infer<typeof ProposalInputSchema>;

export const LABELS: Partial<Record<keyof ProposalInput, string>> = {
  businessName: "Business name",
  websiteUrl: "Existing website",
  detectedSiteNotes: "Auto-detected from existing website",
  industries: "Industries",
  country: "Country / market",
  currency: "Currency",
  timezone: "Timezone",
  dateFormat: "Date format",
  address: "Business address",
  city: "City",
  state: "State / region",
  postalCode: "Postal code",
  businessEmail: "Business email",
  businessPhone: "Business phone",
  registrationNumber: "Business registration number",
  mapsUrl: "Google Maps URL",
  contactName: "Contact person",
  contactPosition: "Contact position",
  contactPhone: "Contact phone",
  contactEmail: "Contact email",
  preferredContact: "Preferred contact method",
  description: "Business description",
  targetAudience: "Target audience",
  services: "Services",
  products: "Products",
  competitors: "Competitor websites",
  goals: "Business goals",
  seoGoals: "SEO goals (plain language)",
  marketingGoals: "Marketing goals",
  budget: "Budget",
  deadline: "Deadline",
  pages: "Number of pages",
  languages: "Languages",
  style: "Preferred design style",
  brandPersonality: "Brand personality",
  colorMode: "Colour approach",
  colors: "Preferred colours",
  fonts: "Preferred fonts",
  cms: "Website management preference",
  integrations: "Integrations",
  specialRequirements: "Special requirements",
};

export const emptyProposalInput = (): ProposalInput => ({
  ...ProposalInputSchema.partial({ businessName: true }).parse({}),
  businessName: "",
});