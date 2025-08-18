import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';
export declare class DriverService {
    private driverRepository;
    private jwtService;
    constructor(driverRepository: Repository<Driver>, jwtService: JwtService);
    create(createDriverDto: CreateDriverDto): Promise<{
        message: string;
        data: Driver;
    }>;
    findAll(): Promise<Driver[]>;
    findOne(id: number): Promise<Driver>;
    update(id: number, updateDriverDto: UpdateDriverDto): Promise<{
        message: string;
        data: Driver;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    validateDriver(email: string, password: string): Promise<{
        message: string;
        data: {
            id: number;
            name: string;
            email: string;
            nid: string;
            nidImage: string;
            isActive: boolean;
        };
        access_token: string;
    }>;
    findByEmail(email: string): Promise<Driver>;
}
