import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

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

    @IsNumber()
    @IsNotEmpty()
    siteId: number;

    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
    
    @IsEnum(['Open', 'In Progress', 'Resolved', 'Closed'])
    status: string;

    @IsEnum(['Low', 'Medium', 'High', 'Critical'])
    priority: string;

}
