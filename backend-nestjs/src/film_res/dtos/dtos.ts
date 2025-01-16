import { IsString, IsInt, IsArray, ValidateNested, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

class AddFilmActorDto {
    @IsString()
    actorName: string;

    @IsString({ each: true })
    @IsArray()
    career: string[];

    @IsString()
    date_of_birth: string;

    @IsString()
    place_of_birth: string;

    @IsString()
    sex: string;

    @IsInt()
    age: number;

    @IsInt()
    growth: number;

    @IsString()
    biography: string;
}

export class addFilmDto {
    @IsString()
    filmName: string;

    @IsString()
    description: string;

    @IsInt()
    yearProd: number;

    @IsString()
    ageRating: string;

    @IsString()
    watchTime: string;

    @IsArray()
    @IsString({ each: true })
    country: string[];

    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    rating: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddFilmActorDto)
    actors: AddFilmActorDto[];

    @IsArray()
    @IsString({ each: true }) // Каждый элемент массива — строка
    genres: string[];
}

