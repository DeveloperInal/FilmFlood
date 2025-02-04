"use client"

import { useState, type MouseEvent } from "react"
import { Star } from "lucide-react"

interface CommentDetailsProps {
    handleSubmit: (rating: number, comment: string) => void
}

export default function CommentDetails({ handleSubmit }: CommentDetailsProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    const onSubmit = () => {
        handleSubmit(rating, comment)
        setRating(0)
        setComment("")
    }

    const handleTextareaMouseDown = (e: MouseEvent<HTMLTextAreaElement>) => {
        e.stopPropagation()
    }

    return (
        <div className="flex flex-col space-y-4 p-4 w-full max-w-2xl mx-auto bg-black text-white">
            <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={24}
                        className={`cursor-pointer transition-colors ${
                            star <= rating ? "text-blue-400 fill-blue-400" : "text-gray-600"
                        }`}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
            <textarea
                className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg
                          text-white placeholder-gray-400 focus:outline-none focus:border-blue-500
                          resize-none"
                rows={4}
                placeholder="Оставьте свой комментарий..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onMouseDown={handleTextareaMouseDown}
            />
            <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                         transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:ring-offset-2 focus:ring-offset-black"
                onClick={onSubmit}
            >
                Отправить
            </button>
        </div>
    )
}

