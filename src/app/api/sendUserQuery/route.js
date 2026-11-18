import { NextResponse } from "next/server";
import { sendMail } from "@/libs/mail";

function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export async function POST(request) {
    try {
        const { name, email, message } = await request.json();

        const cleanName = String(name || "").trim();
        const cleanEmail = String(email || "").trim();
        const cleanMessage = String(message || "").trim();

        if (!cleanName || !cleanEmail || !cleanMessage) {
            return NextResponse.json({ error: "Please fill in your name, email, and message." }, { status: 400 });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
        }

        const to =
            process.env.CONTACT_EMAIL ||
            process.env.SMTP_EMAIL ||
            "dhanak2k25@gmail.com";
        const subject = `[IGTS Dhanak 2027] Query from ${cleanName}`;
        const body = `
            <div style="font-family: Arial, sans-serif; max-width: 560px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="margin: 0 0 12px; color: #1e293b;">New Support Query — IGTS Dhanak 2027</h2>
                <p style="margin: 4px 0;"><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
                <p style="margin: 4px 0;"><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 14px 0;" />
                <p style="margin: 0; white-space: pre-wrap; color: #334155;">${escapeHtml(cleanMessage)}</p>
            </div>
        `;

        await sendMail({ to, name: cleanName, subject, body, replyTo: cleanEmail });

        return NextResponse.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("Failed to send email:", error);
        return NextResponse.json({ error: "Failed to send message right now. Please try again shortly." }, { status: 500 });
    }
}


