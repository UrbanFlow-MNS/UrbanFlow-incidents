import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInterventionDto {

    @IsNotEmpty()
    incidentId: number;

    @IsNumber()
    @IsOptional()
    userId?: number;

    @IsNumber()
    @IsNotEmpty()
    siteId: number;

    @IsDate()
    @Type(() => Date)
    startAt: Date;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endAt?: Date;

    @IsString()
    @IsOptional()
    workNote?: string;

    @IsNumber()
    @IsOptional()
    travelTimes?: number;

    @IsNumber()
    @IsOptional()
    workTimes?: number;
    
}
