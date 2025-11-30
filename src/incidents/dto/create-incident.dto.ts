import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateIncidentDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsString()
    @IsNotEmpty()
    createdBy: string;

    @IsString()
    @IsNotEmpty()
    siteId: string;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsEnum()
    @IsNotEmpty()
    priority: Enumerator;

    @IsEnum()
    @IsNotEmpty()
    status: Enumerator;

}
