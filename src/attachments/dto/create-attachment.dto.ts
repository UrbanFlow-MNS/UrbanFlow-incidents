import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAttachmentDto {

    @IsNumber()
    @IsNotEmpty()
    incidentId: number;

    @IsNumber()
    @IsNotEmpty()
    updatedBy: number;

    @IsString()
    @IsNotEmpty()
    contentUrl: string;

    @IsString()
    @IsOptional()
    contentType?: string;

}
