import { Driver } from '../../driver/entities/driver.entity';
export declare class Bus {
    id: number;
    busNumber: string;
    route: string;
    capacity: number;
    driver: Driver;
}
