import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DriverService {
    constructor(
        @InjectRepository(Driver)
        private driverRepository: Repository<Driver>,
        private jwtService: JwtService,
    ) {}

    async create(createDriverDto: CreateDriverDto) {
        try {
            // Check if email already exists
            const existingDriver = await this.driverRepository.findOne({
                where: { email: createDriverDto.email }
            });

            if (existingDriver) {
                throw new HttpException(
                    'Email already registered',
                    HttpStatus.CONFLICT
                );
            }

            const driver = this.driverRepository.create(createDriverDto);
            await this.driverRepository.save(driver);
            return {
                message: 'Driver created successfully',
                data: driver,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new HttpException(
                    'Email already registered',
                    HttpStatus.CONFLICT
                );
            }
            throw new HttpException(
                'Failed to create driver',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAll() {
        try {
            const drivers = await this.driverRepository.find({
                relations: ['buses'],
            });
            return drivers;
        } catch (error) {
            throw new HttpException('Failed to fetch drivers', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { id },
                relations: ['buses'],
            });
            if (!driver) {
                throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
            }
            return driver;
        } catch (error) {
            throw new HttpException('Failed to fetch driver', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: number, updateDriverDto: UpdateDriverDto) {
        try {
            const driver = await this.findOne(id);
            if (updateDriverDto.password) {
                updateDriverDto.password = await bcrypt.hash(updateDriverDto.password, 10);
            }
            await this.driverRepository.update(id, updateDriverDto);
            return {
                message: 'Driver updated successfully',
                data: await this.findOne(id),
            };
        } catch (error) {
            throw new HttpException('Failed to update driver', HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: number) {
        try {
            const driver = await this.findOne(id);
            await this.driverRepository.remove(driver);
            return {
                message: 'Driver deleted successfully',
            };
        } catch (error) {
            throw new HttpException('Failed to delete driver', HttpStatus.BAD_REQUEST);
        }
    }

    async validateDriver(email: string, password: string) {
        try {
            // Find the driver by email
            const driver = await this.driverRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'name', 'nid', 'nidImage', 'isActive'] // Include password for validation
            });

            // Check if driver exists
            if (!driver || !driver.password) {
                throw new HttpException(
                    'Invalid email or password',
                    HttpStatus.UNAUTHORIZED
                );
            }

            // Validate password
            const isPasswordValid = await bcrypt.compare(password, driver.password);
            if (!isPasswordValid) {
                throw new HttpException(
                    'Invalid email or password',
                    HttpStatus.UNAUTHORIZED
                );
            }

            // Generate JWT token
            const payload = { 
                sub: driver.id, 
                email: driver.email 
            };

            const access_token = this.jwtService.sign(payload);

            // Return success response without password
            return {
                message: 'Login successful',
                data: {
                    id: driver.id,
                    name: driver.name,
                    email: driver.email,
                    nid: driver.nid,
                    nidImage: driver.nidImage,
                    isActive: driver.isActive
                },
                access_token
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.error('Login error:', error);
            throw new HttpException(
                'Authentication failed',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findByEmail(email: string) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { email },
            });
            if (!driver) {
                throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
            }
            return driver;
        } catch (error) {
            throw new HttpException('Failed to fetch driver', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
