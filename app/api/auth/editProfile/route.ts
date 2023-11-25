import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import db from '@/libs/prisma'

export async function PUT(request: any) {
    try {
        const data = await request.json()
        const userAuthorized = await db.user.findUnique(
            {
                where: {
                    email: data.userEmail
                }
            }
        )

        if (userAuthorized?.type !== 2 || userAuthorized?.id !== 1) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            )
        }

        const userEdited = await db.user.findUnique(
            {
                where: {
                    id: parseInt(data.id)
                }
            }
        )
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
            if (userFound && (userEdited?.username.toUpperCase() !== userFound.username.toUpperCase())) {
                return NextResponse.json(
                    { message: "User already exists" },
                    { status: 400 },
                )
            }
            if (emailFound && userEdited?.email.toUpperCase() !== emailFound?.email.toUpperCase()) {
                return NextResponse.json(
                    { message: "Email already exists" },
                    { status: 400 },
                )
            }

        }
        console.log(data)
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const newUser = await db.user.update({
            where: {
                id: parseInt(data.id)
            },
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                type: parseInt(data.type)
            }
        })

        const { password: _, ...user } = newUser

        return NextResponse.json(newUser)
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error)
            return NextResponse.json(
                { message: error.message, },
                {
                    status: 500,
                }
            )
        }
    }
}
