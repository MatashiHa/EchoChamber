import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/initial-modal";
const SetupPage =async () => {

  const profile = await initialProfile();

  //находим первый сервер, в котором находится пользвоатель
  const chamber = await db.chamber.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }

  })

  if (chamber)  {
    return redirect(`chamber/${chamber.id}`)
  }
  else {
    return(<InitialModal/>)
  }
}
 
export default SetupPage;