import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@/libs/prisma';
import bcrypt from 'bcryptjs';
import "dotenv/config";
const CryptoJS = require('crypto-js');
import Security from '@/components/security';

const llave = process.env.NEXT_PUBLIC_CRYPTO;

declare module 'next-auth' {
    interface User {
        id: number;
    }
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
                const security = new Security();
                if (!userFound) throw new Error("User not found");

                // const decryptedPassword = CryptoJS.AES.decrypt(userFound.password, llave);
                const decryptedPassword = security.decrypt(userFound.password);
                console.log(decryptedPassword)
                if (decryptedPassword) {
                    const matchPassword = bcrypt.compare(decryptedPassword, credentials.password);
                    if (!matchPassword) throw new Error("Wrong password");
                }


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
