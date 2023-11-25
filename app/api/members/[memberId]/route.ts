import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
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

    const chamber = await db.chamber.update({
      where: {
        id: chamberId,
        profileId: profile.id,
      },
      data: {
        members: {
          delete: {
            id: params.memberId,
            profileId: {
              not: profile.id,
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
        profileId: profile.id,
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
