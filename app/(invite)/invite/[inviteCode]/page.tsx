import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IviteCodePageProps {
    params:{
        inviteCode: string
    }
}

const InviteCodePage = async ({params}:IviteCodePageProps) => {
    
    const profile = await currentProfile()
    if(!profile)
    {
        return redirectToSignIn();
    }
    if (!params.inviteCode)
    {
        return redirect("/")
    }
// ищем, находится ли уже данный пользователь на сервере, куда его пытаются пригласить
    const existingChamber = await db.chamber.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some:{
                    profileId: profile.id
                }
            }
        }
    })
    // если человек уже находится на сервере, куда ему прислали ссылку приглашения
    if (existingChamber) {
        return redirect(`/chambers/${existingChamber.id}`)

    }

    const chamber = await db.chamber.update({
        where:{
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create:[
                    {
                        profileId:profile.id
                    }
                ]
            }
        }
    })
    if (chamber){
        return redirect(`/chambers/${chamber.id}`)
    }
    return ( 
       null
     );
}
 
export default InviteCodePage;