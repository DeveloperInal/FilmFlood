"use client"

import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/service/UserService";
import Loading from "@/components/ui/loading"
import ProfileDetails from "./ProfileDetails"
import NotFound from "@/app/not-found"

export default function ProfileContent() {
    const { data: user, isLoading, error } = useQuery({
        queryKey: ["userProfile"],
        queryFn: UserService.getUserProfile,
    })

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <NotFound />
    }

    return (
        <div>
            <ProfileDetails user={{
                ...user,
                createProfile: user?.createProfile ?? null,
                updatedProfile: user?.updatedProfile ?? null,
                imageProfile: user?.imageProfile ?? null,
                comments: user?.comments ?? []
            }} />
        </div>
    )
}