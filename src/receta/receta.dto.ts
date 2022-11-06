import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RecetaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsUrl()
  @IsNotEmpty()
  readonly foto: string;

  @IsUrl()
  @IsNotEmpty()
  readonly video: string;

  @IsString()
  @IsNotEmpty()
  readonly preparacion: string;
}
