import { NextResponse } from "next/server";
import db from '@/libs/prisma';

export async function DELETE(request: { json: () => any }) {
    try {
        const { userEmail, id } = await request.json()
        console.log(userEmail)
        const userAuthorized = await db.user.findUnique(
            {
                where: {
                    email: userEmail
                }
            }
        )
        console.log(userAuthorized?.type)
        if (userAuthorized?.type !== 2) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            )
        }
        console.log(id)
        // Delete the user from the database
        await db.user.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }
    }
}