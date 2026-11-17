import ImageKit from "imagekit";
import { NextResponse } from "next/server";
import { requireProfile, ADMIN_ROLES } from "@/libs/supabase/server";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function POST(req) {
    // Only question admins upload images (used by the Add Question page)
    const { response } = await requireProfile({ roles: ADMIN_ROLES });
    if (response) return response;

    const authResult = imagekit.getAuthenticationParameters();
    return NextResponse.json(authResult, {
        status: 200,
    });
}
