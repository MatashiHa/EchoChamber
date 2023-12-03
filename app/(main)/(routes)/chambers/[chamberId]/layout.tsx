import { ChannelsSidebar } from "@/components/chamber/channels-sidebar";
import { MembersSidebar } from "@/components/chamber/members-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ChamberIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { chamberId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const chamber = await db.chamber.findUnique({
    where: {
      id: params.chamberId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  const member = await db.member.findFirst({
    where: {
      chamberId: params.chamberId,
      profileId: profile.id,
    },
  });

  if (!chamber) {
    return redirect("/");
  }

  return (
    <div className="h-full justify-between">
      <div className="hidden lg:flex f-full w-60 z-20 flex-col inset-y-0 border dark:border-gray-900 fixed">
        <ChannelsSidebar chamberId={params.chamberId} role={member?.role} />
      </div>
      <main className="lg:pl-60 bg-white dark:bg-slate-800">{children}</main>
      <div className="hidden lg:flex top-0 right-0 f-full w-64 z-20 flex-col inset-y-0 border dark:border-gray-900 fixed">
        <MembersSidebar chamberId={params.chamberId} role={member?.role} />
      </div>
    </div>
  );
};

export default ChamberIdLayout;
