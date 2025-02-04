'use client';

import Loading from "@/components/ui/loading";
import FilmDetails from './FilmDetails';
import { useQuery } from "@tanstack/react-query";
import { FilmService } from "@/service/FilmService";

interface FilmContentProps {
    filmName: string;
}

const FilmContent: React.FC<FilmContentProps> = ({filmName}): JSX.Element => {
    const { data: film, isLoading } = useQuery({
        queryKey: ['filmName', filmName],
        queryFn: () => FilmService.getFilmNameData(filmName),
        throwOnError: true
    });

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <FilmDetails film={film} />
        </div>
    );
}

export default FilmContent;