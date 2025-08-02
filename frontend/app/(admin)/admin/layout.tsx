import { getSessionContext } from "@/lib/serverContext";
import { redirect } from "next/navigation";
import type React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const { authenticated, user } = await getSessionContext();

    if (!authenticated || !user?.data?.admin) {
        redirect("/auth/login")
    }

    return <>{children}</>
}
