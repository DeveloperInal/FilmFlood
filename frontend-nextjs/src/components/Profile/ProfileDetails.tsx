import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Calendar, MessageSquare, Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ImageUpload from "./ImageUpload"
import Link from "next/link";

interface Comment {
    filmName: string
    yearProd: number
    text: string
    filmPoster: string
}

interface UserProfile {
    username: string
    email: string
    createProfile: string
    updatedProfile: string
    imageProfile: string
    comments: Comment[]
}

function formatDate(dateString: string) {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    } catch (error) {
        return "Дата недоступна"
    }
}

function ProfileSkeleton() {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-72" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

export default function ProfilePage({ user }: { user?: UserProfile }) {
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <ProfileSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                                    <AvatarImage src={user.imageProfile} alt={user.username} />
                                    <AvatarFallback>{user.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                                </Avatar>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute bottom-0 right-0 rounded-full p-2 bg-blue-500 hover:bg-blue-600"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
                                        <DialogHeader>
                                            <DialogTitle className="text-white">Изменить фото профиля</DialogTitle>
                                        </DialogHeader>
                                        <ImageUpload currentImage={user.imageProfile} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="text-center md:text-left">
                                <CardTitle className="text-2xl md:text-3xl font-bold mb-2">{user.username}</CardTitle>
                                <div className="flex flex-col space-y-2 text-sm text-gray-400">
                                    <div className="flex items-center justify-center md:justify-start space-x-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Профиль создан: {formatDate(user.createProfile)}</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Последнее обновление: {formatDate(user.updatedProfile)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Комментарии к фильмам ({user.comments?.length ?? 0})
                        </h2>
                        {user.comments && user.comments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.comments.map((comment, index) => (
                                    <Card key={index} className="bg-gray-700 border-gray-600">
                                        <CardContent className="p-4">
                                            <Link key={index} href={`/film/${encodeURIComponent(comment.filmName)}`} className="group">
                                            <div className="flex items-start space-x-4">
                                                {comment.filmPoster ? (
                                                    <img
                                                        src={comment.filmPoster || "/placeholder.svg"}
                                                        alt={comment.filmName}
                                                        className="w-20 h-30 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-30 bg-gray-600 rounded flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">Нет постера</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-lg">{comment.filmName}</h3>
                                                    <p className="text-sm text-gray-400 mb-2">{comment.yearProd}</p>
                                                    <p className="text-sm">{comment.text}</p>
                                                </div>

                                            </div>
                                        </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-8">Пользователь еще не оставил комментариев</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

