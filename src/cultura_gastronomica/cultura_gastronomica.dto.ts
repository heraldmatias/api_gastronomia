import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class CulturaGastronomicaDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
}
