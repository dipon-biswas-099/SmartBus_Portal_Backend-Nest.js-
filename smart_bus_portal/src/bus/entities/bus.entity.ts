import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Driver } from '../../driver/entities/driver.entity';

@Entity()
export class Bus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    busNumber: string;

    @Column()
    route: string;

    @Column()
    capacity: number;

    @ManyToOne(() => Driver, driver => driver.buses)
    driver: Driver;
}