import { NextResponse } from "next/server";
import db from '@/libs/prisma';

export async function POST(request: any) {
    try {
        const { email } = await request.json(); // Assuming the request body contains the user ID to be retrieved

        // Get the user from the database
        const user = await getUser(email);
        console.log(user)
        return NextResponse.json(user);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }
    }
}

async function getUser(email: string) {
    const user = await db.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            username: true,
            email: true,
            type: true
        },
    });

    return user;
}