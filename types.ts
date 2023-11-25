import { Chamber, Member, Profile } from "@prisma/client";

export type ChamberWithMembersWithProfiles = Chamber & {
  members: (Member & { profile: Profile })[];
};
