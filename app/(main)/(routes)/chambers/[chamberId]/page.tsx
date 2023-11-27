import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChamberIdPageProps {
  params: {
    chamberId: string
  }
}

const ChamberPage = async ({params}: ChamberIdPageProps) => {
  
  const profile = await currentProfile()
  //если пользователь не авторизован, его возвращает на страницу авторизации
  if(!profile){
    return redirectToSignIn()
  }
  const chamber = await db.chamber.findUnique({
    where:{
      id: params.chamberId,
      members: {
        some:{
          profileId: profile.id
        }
      }
    },
    include:{
      channels:{
        where:{
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })
  // первый канал всегда general. По этому можем вызвать его так:
  const initialChannel = chamber?.channels[0]
  if(initialChannel?.name !=="general"){
    // на всякий случай, если главного канала нет, возвращаем пустую страницу
    return null;
  }
  //переводим его в канал "general"
  return redirect(`/chambers/${params.chamberId}/channels/${initialChannel?.id}`);
};

export default ChamberPage;
