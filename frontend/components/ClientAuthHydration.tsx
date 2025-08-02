'use client'

import { useEffect } from "react"

import type { User } from "@/lib/types"
import { useAuthStore } from "@/lib/auth"

export default function ClientAuthHydration({ user }: { user: User | null }) {
  const hydrateFromServer = useAuthStore((state) => state.hydrateFromServer)

  useEffect(() => {
    if (user) {
      hydrateFromServer(user)
    }
  }, [user, hydrateFromServer])

  return null
}
