import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import db from '@/libs/prisma'



export async function POST(request: any) {
    try {
        const data = await request.json()
        const userAuthorized = await db.user.findUnique(
            {
                where: {
                    email: data.userEmail
                }
            }
        )
        if (userAuthorized?.type !== 2) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            )
        }
        const userFound = await db.user.findUnique(
            {
                where: {
                    username: data.username
                }
            }
        )

        const emailFound = await db.user.findUnique(
            {
                where: {
                    email: data.email
                }
            }
        )

        if (userFound || emailFound) {
            if (userFound) {
                return NextResponse.json(
                    { message: "User already exists" },
                    { status: 400 },
                )
            }
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 },
            )

        }
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const newUser = await db.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                type: parseInt(data.type)
            }
        })

        const { password: _, ...user } = newUser

        return NextResponse.json("User created")
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