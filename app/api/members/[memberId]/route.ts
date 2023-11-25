import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    //const res = req.json();
    const { searchParams } = new URL(req.url);
    const chamberId = searchParams.get("chamberId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!chamberId) {
      return new NextResponse("Chamber ID Missing", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }
    console.log("Deletion started");

    const chamber = db.chamber.update({
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
        }, // вот тут настраивается, может ли кто-то кроме админа менять роли
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
              //чтобы не удалить самого себя
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    console.log("Deletion complete");
    return NextResponse.json(chamber);
  } catch (error) {
    console.log("[MEMBERS_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const chamberId = searchParams.get("chamberId");

    if (!profile) {
      return new NextResponse("Unaothorized", { status: 401 });
    }
    if (!chamberId) {
      return new NextResponse("Chamber ID Missing", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }

    const chamber = await db.chamber.update({
      where: {
        id: chamberId,
        // вот тут настраивается, может ли кто-то кроме админа менять роли
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
                //чтобы не поменять роль самому себе
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(chamber);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
