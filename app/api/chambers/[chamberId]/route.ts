import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { chamberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const chamber = await db.chamber.update({
      where: {
        id: params.chamberId,
        //тут добавляется фильтрация по тому, какая роль может быть у изменяющего сервер
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(chamber);
  } catch (error) {
    console.log("[CHAMBER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
