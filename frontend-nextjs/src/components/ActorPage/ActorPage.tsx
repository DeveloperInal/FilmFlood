import Header from '@/components/ui/header';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import ActorContent from "@/components/ActorPage/ActorContent";
import { useParams } from "next/navigation";

export default function ActorPage() {
    const params = useParams()
    const actorName = (params.actorName as string)

    return (
        <div className="min-h-screen bg-black">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 flex justify-center p-6">
                    <Card className="max-w-4xl w-full bg-black border-[#8B0000]">
                        <CardContent className="p-6">
                            <ActorContent actorName={decodeURIComponent(actorName)} />
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
};

export const getServerSideProps = async (context) => {
    const { actorName } = context.params; // Динамическая часть маршрута
    console.log('Context params:', actorName);

    if (!actorName) {
        return {
            notFound: true, // Если имени нет, возвращаем 404
        };
    }

    return {
        props: {
            actorName,
        },
    };
};

