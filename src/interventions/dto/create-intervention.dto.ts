import { IsNotEmpty } from "class-validator";

export class CreateInterventionDto {

    @IsNotEmpty()
    incidentId: number;

    userId?: number;

    @IsNotEmpty()
    siteId: number;

    @IsNotEmpty()
    startAt: Date;

    endAt?: Date;

    workNote?: string;

    travelTimes?: number;

    workTimes?: number;



    
}
