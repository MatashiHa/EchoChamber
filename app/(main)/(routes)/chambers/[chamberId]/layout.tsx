//import { ChamberSidebar } from "@/components/chamber/chamber-sidebar";
import { ChannelsSidebar } from "@/components/chamber/channels-sidebar";
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

  if (!chamber) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex f-full w-60 z-20 flex-col inset-y-0 fixed">
        <ChannelsSidebar chamberId={params.chamberId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ChamberIdLayout;
