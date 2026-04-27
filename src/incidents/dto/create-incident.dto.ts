import { IsString, IsNotEmpty, IsEnum, IsNumber, IsArray, IsOptional } from 'class-validator';
import { IncidentStatus } from 'src/models/enums/enums';
import { IncidentPriority } from 'src/models/enums/enums';
export class CreateIncidentDto {

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    estimateDuration: number;

    @IsNumber()
    @IsNotEmpty()
    createdBy: number;

    @IsNumber()
    @IsNotEmpty()
    siteId: number;

    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
    
    @IsEnum(IncidentStatus)
    status: string;

    @IsEnum(IncidentPriority)
    priority: string;

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    affectedStopIds?: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    affectedRouteIds?: number[];

}
