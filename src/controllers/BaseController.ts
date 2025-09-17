import { prisma } from "../../prisma/index.js";

export default class BaseController<T> {
    protected prismaClient = prisma;
    protected model: any;

    constructor(model: any) {
        this.model = model;
    }

    async findAll(): Promise<T[]> {
        return this.model.findMany();
    }

    async findById(id: number): Promise<T | null> {
        return this.model.findUnique({ where: { id } });
    }

    async create(data: any): Promise<T> {
        return this.model.create({ data: data });
    }

    async update(id: number, data: any): Promise<T> {
        return this.model.update({ where: { id }, data });
    }

    async delete(id: number): Promise<T> {
        return this.model.delete({ where: { id } });
    }
}
