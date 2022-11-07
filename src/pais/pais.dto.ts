import { IsNotEmpty, IsString } from 'class-validator';
export class PaisDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
}
