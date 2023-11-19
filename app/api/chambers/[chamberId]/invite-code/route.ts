import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      chamberId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unaothorized", { status: 401 });
    }
    if (!params.chamberId) {
      return new NextResponse("Chamber ID Missing", { status: 400 });
    }

    const chamber = await db.chamber.update({
      where: {
        id: params.chamberId,
        profileId: profile.id,
      },
      // TODO: сделать возможность приглашать на сервер не только админу
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(chamber);
  } catch (error) {
    console.log("[CHAMBER_ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
