import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

export interface StackCompoundInput {
  compoundId: string;
  dosageMg: number;
  frequency: string;
  isAncillary: boolean;
}

export interface CreateStackInput {
  name: string;
  compounds: StackCompoundInput[];
  durationWeeks: number;
  goal?: string;
  notes?: string;
}
