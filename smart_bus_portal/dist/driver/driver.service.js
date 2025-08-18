"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const driver_entity_1 = require("./entities/driver.entity");
const bcrypt = require("bcrypt");
let DriverService = class DriverService {
    driverRepository;
    jwtService;
    constructor(driverRepository, jwtService) {
        this.driverRepository = driverRepository;
        this.jwtService = jwtService;
    }
    async create(createDriverDto) {
        try {
            const existingDriver = await this.driverRepository.findOne({
                where: { email: createDriverDto.email }
            });
            if (existingDriver) {
                throw new common_1.HttpException('Email already registered', common_1.HttpStatus.CONFLICT);
            }
            const driver = this.driverRepository.create(createDriverDto);
            await this.driverRepository.save(driver);
            return {
                message: 'Driver created successfully',
                data: driver,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error.code === '23505') {
                throw new common_1.HttpException('Email already registered', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException('Failed to create driver', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            const drivers = await this.driverRepository.find({
                relations: ['buses'],
            });
            return drivers;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch drivers', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { id },
                relations: ['buses'],
            });
            if (!driver) {
                throw new common_1.HttpException('Driver not found', common_1.HttpStatus.NOT_FOUND);
            }
            return driver;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch driver', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateDriverDto) {
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
        }
        catch (error) {
            throw new common_1.HttpException('Failed to update driver', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            const driver = await this.findOne(id);
            await this.driverRepository.remove(driver);
            return {
                message: 'Driver deleted successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to delete driver', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validateDriver(email, password) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { email },
                select: ['id', 'email', 'password', 'name', 'nid', 'nidImage', 'isActive']
            });
            if (!driver || !driver.password) {
                throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
            }
            const isPasswordValid = await bcrypt.compare(password, driver.password);
            if (!isPasswordValid) {
                throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
            }
            const payload = {
                sub: driver.id,
                email: driver.email
            };
            const access_token = this.jwtService.sign(payload);
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
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            console.error('Login error:', error);
            throw new common_1.HttpException('Authentication failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByEmail(email) {
        try {
            const driver = await this.driverRepository.findOne({
                where: { email },
            });
            if (!driver) {
                throw new common_1.HttpException('Driver not found', common_1.HttpStatus.NOT_FOUND);
            }
            return driver;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch driver', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], DriverService);
//# sourceMappingURL=driver.service.js.map