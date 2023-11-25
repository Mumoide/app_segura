// components/useServerSession.ts

import { useState, useEffect } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";

function useServerSession() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const serverSession = await getServerSession(authOptions);
                console.log("Server Session:", serverSession);
                setSession(serverSession);
            } catch (error) {
                console.error("Error fetching session:", error);
            }
        };

        fetchSession();
    }, []); // Run only on component mount

    return session;
}

export default useServerSession;
