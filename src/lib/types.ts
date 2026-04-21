import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      isPremium: boolean;
      discordLinked: boolean;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    isPremium?: boolean;
    discordLinked?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    isPremium: boolean;
    discordLinked: boolean;
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
