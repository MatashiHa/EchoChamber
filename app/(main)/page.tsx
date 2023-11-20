import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { initialProfile } from "@/lib/initial-profile";

export default async function Home() {
  const profile = await initialProfile();

  if (profile) {
    return (
      <div className="ml-4">
        <UserButton afterSignOutUrl="/" />
        <ModeToggle />
        <p className="h-full flex text-2xl font-bold">You've been logged in!</p>
        <a href="/setup" className=" hover:underline text-blue-700">
          [DEV] Go to setup page
        </a>
      </div>
    );
  }
}
