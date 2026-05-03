import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSiteDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    zipcode: string;

    @IsNumber() //Je ne sais pas si je dois mêttre un number, si ca pose problème, j'ai trouvé ca dans la doc
    @IsNotEmpty()
    latitude: number;

    @IsNumber() // Same 
    @IsNotEmpty()
    longitude: number;

    @IsString()
    @IsOptional()
    contactName?: string;

    @IsString()
    @IsOptional()
    contactPhone?: string;
}
