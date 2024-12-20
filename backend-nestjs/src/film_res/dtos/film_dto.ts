import { IsString, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddFilmActorDto {
    @IsString()
    name: string;

    @IsString()
    date_of_birth: string;

    @IsInt()
    height: number;

    @IsString()
    biography: string;
}

export class addFilmDto {
    @IsString()
    film_name: string;

    @IsString()
    description: string;

    @IsInt()
    year_prod: number;

    @IsString()
    country: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddFilmActorDto)
    actors: AddFilmActorDto[];

    @IsArray()
    @IsString({ each: true }) // Каждый элемент массива — строка
    genres: string[];
}