import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm';
import { Bus } from '../../bus/entities/bus.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Don't select password by default
    password: string;

    @Column()
    nid: string;

    @Column({ nullable: true })
    nidImage: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Bus, bus => bus.driver)
    buses: Bus[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}