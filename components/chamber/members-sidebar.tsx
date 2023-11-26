import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { MembersSection } from "./members-section";
import { ChamberMember } from "./chamber-member";

interface MembersSidebarProps {
  chamberId: string;
  role?: MemberRole;
}

export const MembersSidebar = async ({
  chamberId,
  role,
}: MembersSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const chamber = await db.chamber.findUnique({
    where: {
      id: chamberId,
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const members = chamber?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!chamber) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#192235] bg-[#F2F3F5]">
      <ScrollArea className="flex-1 px-3">
        {!!members?.length && (
          <div className="mb-2">
            <MembersSection
              sectionType="members"
              role={role}
              label="Members"
              chamber={chamber}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ChamberMember
                  key={member.id}
                  member={member}
                  chamber={chamber}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
