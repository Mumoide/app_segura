import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@/libs/prisma';
import bcrypt from 'bcryptjs';
import "dotenv/config";

const llave = process.env.NEXT_PUBLIC_CRYPTO;

declare module 'next-auth' {
    interface User {
        id: number;
    }
}

function decrypt(tex: string, key: string) {
    return String.fromCharCode(
        ...(tex.match(/.{1,2}/g) || []).map((e, i) =>
            parseInt(e, 16) ^ key.charCodeAt(i % key.length) % 255
        )
    );
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req) {
                const userFound = await db.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!userFound) throw new Error("User not found");

                const decryptedPassword = decrypt(credentials.password, llave as string);
                const matchPassword = await bcrypt.compare(decryptedPassword, userFound.password);
                console.log(matchPassword)
                if (!matchPassword) throw new Error("Wrong password");



                return {
                    id: userFound.id,
                    username: userFound.username,
                    email: userFound.email
                };
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
