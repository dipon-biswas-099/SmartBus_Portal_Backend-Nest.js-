import {
  IsString,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only alphabets',
  })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'NID is required' })
  @Matches(/^\d{10,17}$/, {
    message: 'NID must be between 10 to 17 digits',
  })
  nid: string;

  @IsOptional()
  @IsString()
  nidImage?: string;
}
