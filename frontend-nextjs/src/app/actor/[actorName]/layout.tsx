import '../../globals.css'

export const metadata = {
    title: 'ActorPage',
};

export default function ActorLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-black text-white">
            {children}
            </div>
    )
}