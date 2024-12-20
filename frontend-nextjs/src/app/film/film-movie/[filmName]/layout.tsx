import '../../../globals.css'

export const metadata = {
    title: 'Film Page',
};

export default function FilmMovieLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-black text-white h-screen flex flex-col">
            {children}
        </div>
    );
}
