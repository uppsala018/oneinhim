import type { FieldValue, Timestamp } from "firebase/firestore";

export const christianTraditions = [
  "Catholic",
  "Orthodox",
  "Protestant",
  "Non-denominational",
] as const;

export type ChristianTradition = (typeof christianTraditions)[number];

export type SocialLinks = {
  youtube: string;
  facebook: string;
  instagram: string;
  x: string;
  tiktok: string;
};

export type UserProfileFormValues = {
  displayName: string;
  christianTradition: "" | ChristianTradition;
  bio: string;
  websiteUrl: string;
  socialLinks: SocialLinks;
};

export type AvatarStatus = "none" | "pending" | "approved" | "rejected";

export type UserProfile = UserProfileFormValues & {
  uid: string;
  email: string;
  avatarStatus?: AvatarStatus;
  avatarStoragePath?: string;
  avatarApprovedURL?: string;
  role?: string;
  betaSignedUp?: boolean;
  isBanned?: boolean;
  isRestricted?: boolean;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
};

export const emptySocialLinks: SocialLinks = {
  youtube: "",
  facebook: "",
  instagram: "",
  x: "",
  tiktok: "",
};

export const emptyProfileForm: UserProfileFormValues = {
  displayName: "",
  christianTradition: "",
  bio: "",
  websiteUrl: "",
  socialLinks: emptySocialLinks,
};

export function toProfileFormValues(data: Partial<UserProfile> | undefined): UserProfileFormValues {
  return {
    displayName: data?.displayName ?? "",
    christianTradition: data?.christianTradition ?? "",
    bio: data?.bio ?? "",
    websiteUrl: data?.websiteUrl ?? "",
    socialLinks: {
      ...emptySocialLinks,
      ...(data?.socialLinks ?? {}),
    },
  };
}

export function toUserProfile(data: Partial<UserProfile> | undefined): Partial<UserProfile> {
  return {
    ...toProfileFormValues(data),
    uid: data?.uid ?? "",
    email: data?.email ?? "",
    avatarStatus: data?.avatarStatus ?? "none",
    avatarStoragePath: data?.avatarStoragePath ?? "",
    avatarApprovedURL: data?.avatarApprovedURL ?? "",
    // Preserve access/moderation fields — previously dropped, causing silent auth failures
    role: data?.role,
    betaSignedUp: data?.betaSignedUp,
    isBanned: data?.isBanned,
    isRestricted: data?.isRestricted,
  };
}
