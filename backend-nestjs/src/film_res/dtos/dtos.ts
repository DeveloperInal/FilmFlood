import { IsString, IsInt, IsArray, ValidateNested, IsNumber } from 'class-validator';
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

    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: 'Rating must be a valid float with up to 2 decimal places' }
      )
    rating: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddFilmActorDto)
    actors: AddFilmActorDto[];

    @IsArray()
    @IsString({ each: true }) // Каждый элемент массива — строка
    genres: string[];
}

