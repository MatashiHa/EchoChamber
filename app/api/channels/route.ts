import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const chamberId = searchParams.get("chamberId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!chamberId) {
      return new NextResponse("Chamber ID Missing", { status: 400 });
    }
    if (name === "general") {
      return new NextResponse('Channel name cannot be "general"', {
        status: 400,
      });
    }

    const chamber = await db.chamber.update({
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
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });
    return NextResponse.json(chamber);
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
