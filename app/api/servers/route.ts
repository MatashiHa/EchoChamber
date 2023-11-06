import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageURL } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chamber = await db.chamber.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl: imageURL,

        //это код приглашения
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          //создатель сервера сразу регестрируется как админ
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(chamber);
  } catch (error) {
    console.log("[SREVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
