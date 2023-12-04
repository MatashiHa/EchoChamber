import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { NavigationSidebar } from "./navigation/navigation-sidebar";
import { ChannelsSidebar } from "./chamber/channels-sidebar";
import { MembersSidebar } from "./chamber/members-sidebar";
import { MemberRole } from "@prisma/client";

export const MobileToggle = ({
  chamberId,
  role,
}: {
  chamberId: string;
  role: MemberRole;
}) => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden hover:bg-zinc-600 rounded">
        {/* "md-hidden" означает, что эта кнопка показывается только при узком разрешении или на мобильных устройствах */}
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0 ">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <div className="w-full border dark:border-gray-900">
          <ChannelsSidebar chamberId={chamberId} role={role} />
        </div>
        <div className="w-full border dark:border-gray-900">
          <MembersSidebar chamberId={chamberId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
// className = "border dark:border-gray-900"
