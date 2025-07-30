import axios from "axios";
import { cookies } from "next/headers";

export async function getSessionContext() {
    const cookieStore = await cookies(); // synchronous, no need to await
    const session = cookieStore.get("session")?.value || null;
    const sig = cookieStore.get("session.sig")?.value;

    if (!session || !sig) return { authenticated: false, session: null };

    console.log("sesson", session)

    try {
        const data = await axios.get(
            "http://localhost:5000/api/auth/get-me",
            // "https://wsl.rohanthapa.com.np/api/auth/get-me",
            {
                headers: {
                    Cookie: `session=${session}; session.sig=${sig}`,
                },

            }
        );

        console.log(data);

        if (data.status !== 200) return { authenticated: false, session: null };

        return { authenticated: true, user: data?.data };
    } catch (error) {
        console.error("SSR session failed", error);
        return { authenticated: false, session: null };
    }
}
