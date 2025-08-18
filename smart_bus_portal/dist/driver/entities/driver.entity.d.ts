import { Bus } from '../../bus/entities/bus.entity';
export declare class Driver {
    id: number;
    name: string;
    email: string;
    password: string;
    nid: string;
    nidImage: string;
    isActive: boolean;
    buses: Bus[];
    hashPassword(): Promise<void>;
}
