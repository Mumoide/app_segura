import { NextResponse } from "next/server"
import db from '@/libs/prisma'


export async function GET(request: any) {
    try {
        const users = await db.user.findMany(
            {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    type: true
                }
            }
        )

        return NextResponse.json(users)
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: error.message, },
                {
                    status: 500,
                }
            )
        }
    }
}

export const revalidate = 0;