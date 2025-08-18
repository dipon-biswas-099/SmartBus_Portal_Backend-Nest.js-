import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverDto } from './create-driver.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
    @IsOptional()
    @IsString()
    nidImage?: string;

    @IsOptional()
    @IsString()
    password?: string;
}