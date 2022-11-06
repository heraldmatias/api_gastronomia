import {IsDateString, IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';
export class RestauranteDto {
 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly ciudad: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly numeroEstrellas: string;
 
 @IsDateString()
 @IsNotEmpty()
 readonly fechaConsecusionEstrellas: string;
}
