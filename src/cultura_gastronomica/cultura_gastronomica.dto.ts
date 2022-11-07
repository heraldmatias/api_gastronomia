import { IsNotEmpty, IsString } from 'class-validator';
export class CulturaGastronomicaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;
}
