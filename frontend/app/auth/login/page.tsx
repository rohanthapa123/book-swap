"use client"

import { login, updateUserPreferences } from "@/api/auth"; // your login API function
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox";

type LoginFormData = {
  email: string
  password: string
}
const genres = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Mystery",
  "Fantasy",
  "Biography",
  "Autobiography",
  "Romance",
  "Horror",
  "Thriller",
  "Adventure",
  "Drama",
  "Poetry",
  "Self-help",
  "Philosophy",
  "Science Fiction",
  "Children's",
  "Comics",
  "Graphic Novel",
  "Religion",
  "Spirituality",
  "Travel",
  "Art",
  "Crime",
  "Classic Literature",
  "Technology",
  "Education",
  "Parenting",
  "Humor",
  "War & Military",
  "True Crime",
  "Fashion"
]


export default function LoginPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data)
      setUser(data.data)
      if (!data.data.preferences || data.data.preferences.length === 0) {
        setShowDialog(true)
      } else {
        window.location.href = "/"
      }
    },
    onError: (error) => {
      console.error("Login failed:", error)
    },
  })

  const updateGenresMutation = useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: () => {
      setShowDialog(false)
      window.location.href = "/"
    },
    onError: (err) => {
      console.error("Genre submit error:", err)
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }


  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const handleGenreSubmit = () => {
    if (selectedGenres.length > 0 && user) {
      updateGenresMutation.mutate({ id: user.id, preferences: selectedGenres })
    }
  }

  return (
    <>
      {/* Login UI */}
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <BookOpen className="h-12 w-12 text-amber-700" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-amber-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-amber-700 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Genre Selection Dialog */}
      <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Select at least 5 genres you like</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${selectedGenres.includes(genre)
                  ? "bg-amber-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-800 hover:bg-amber-100"
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleGenreSubmit}
              disabled={selectedGenres.length < 4 || updateGenresMutation.isPending}
              className="bg-amber-700 hover:bg-amber-800"
            >
              {updateGenresMutation.isPending ? "Saving..." : "Continue"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
