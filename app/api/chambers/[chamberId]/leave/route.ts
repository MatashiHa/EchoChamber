import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { chamberId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.chamberId) {
      return new NextResponse("Chamber ID Missing", { status: 400 });
    }

    const chamber = await db.chamber.update({
      where: {
        id: params.chamberId,
        profileId: {
          not: profile.id,
          // на случай, чтобы админ сам себя не удалил из сервера
        },
        members: {
          some: {
            profileId: profile.id,
            // это проверка того, что только члены сервера могут его покинуть
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
    return NextResponse.json(chamber);
  } catch (error) {
    console.log("[CHAMBER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
