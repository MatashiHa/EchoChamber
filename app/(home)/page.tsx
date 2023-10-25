import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { initialProfile } from "@/lib/initial-profile";


export default async function Home() {
  const profile = await initialProfile();
  if (profile){
    return (
    

      <div>
        <UserButton
        afterSignOutUrl="/"
        />
        <ModeToggle/>
        <p className="h-full flex text-2xl font-bold"> You've been logged in!</p>
      </div>
    )
  }
  
}
