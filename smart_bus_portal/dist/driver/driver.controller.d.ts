import { Response } from 'express';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { LoginDriverDto } from './dto/login-driver.dto';
import { DriverService } from './driver.service';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    create(createDriverDto: CreateDriverDto, file: Express.Multer.File): Promise<{
        message: string;
        data: import("./entities/driver.entity").Driver;
    }>;
    login(loginDto: LoginDriverDto): Promise<{
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
    findAll(): Promise<import("./entities/driver.entity").Driver[]>;
    findOne(id: number): Promise<import("./entities/driver.entity").Driver>;
    update(id: number, updateDriverDto: UpdateDriverDto, file?: Express.Multer.File): Promise<{
        message: string;
        data: import("./entities/driver.entity").Driver;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getNidImage(name: string, res: Response): void;
}
