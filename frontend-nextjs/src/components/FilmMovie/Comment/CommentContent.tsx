"use client"

import { UserService } from "@/service/UserService"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import Loading from "@/components/ui/loading"
import CommentDetails from "@/components/FilmMovie/Comment/CommentDetails"
import { FilmService } from "@/service/FilmService"
import Image from "next/image"

interface Comment {
    username: string
    text: string
    rating: number
    userImage: string
}

const CommentContent = ({ filmName }: { filmName: string }) => {
    const { addToast } = useToast()

    const {
        data: comments,
        isLoading,
        refetch,
    } = useQuery<Comment[]>({
        queryKey: ["comments", filmName],
        queryFn: async () => {
            const result = await FilmService.getCommentFilm(filmName);
            return Array.isArray(result) ? result : [result];
        },
    })

    const { mutate: addComment, isPending } = useMutation({
        mutationFn: async ({ text, rating }: { text: string; rating: number }) => {
            await UserService.createUserComment({ filmName, rating, text })
        },
        onSuccess: () => {
            addToast("Комментарий успешно добавлен", "success")
            refetch()
        },
        onError: () => {
            addToast("Произошла ошибка при добавлении комментария", "error")
        },
    })

    const handleSubmit = (rating: number, comment: string) => {
        if (rating === 0) {
            addToast("Пожалуйста, выберите рейтинг", "error")
            return
        }
        if (comment.trim() === "") {
            addToast("Пожалуйста, напишите комментарий", "error")
            return
        }
        addComment({ text: comment, rating })
    }

    if (isLoading || isPending) {
        return <Loading />
    }

    return (
        <div className="space-y-8">
            <CommentDetails handleSubmit={handleSubmit} />
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Комментарии</h3>
                {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg flex items-start space-x-4">
                            <Image
                                src={comment.userImage || "/placeholder.svg"}
                                alt={comment.username}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">{comment.username}</span>
                                    <span className="text-yellow-400">{"★".repeat(comment.rating)}</span>
                                </div>
                                <p>{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Пока нет комментариев.</p>
                )}
            </div>
        </div>
    )
}

export default CommentContent

