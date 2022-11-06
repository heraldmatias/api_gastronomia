/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString } from 'class-validator';

export class ProductoDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsString()
    readonly descripcion: string;

    @IsString()
    readonly historia: string;
}
