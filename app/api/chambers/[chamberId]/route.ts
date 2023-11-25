import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { chamberId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { chamberId } = params;

    if (!chamberId) {
      return new NextResponse("Chamber ID Missing", { status: 400 });
    }

    const chamber = await db.chamber.delete({
      where: {
        id: chamberId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN],
            },
          },
          //это фильтрует, что менять то или иное могут только админ или модератор
        },
        //тут добавляется фильтрация по тому, какая роль может быть у изменяющего сервер
      },
    });
    return NextResponse.json(chamber);
  } catch (error) {
    console.log("[CHAMBER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN],
            },
          },
          //это фильтрует, что менять то или иное могут только админ или модератор
        },
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
