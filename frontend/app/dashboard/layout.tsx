
import { getSessionContext } from '@/lib/serverContext';
import { redirect } from 'next/navigation';
import React from 'react'

const layout = async ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {

    const { authenticated, user } = await getSessionContext();


    if (!authenticated) {
        redirect('/auth/login'); // ⛔ Never loads this page at all
    }

    return (
        <div>{children}</div>
    )
}

export default layout