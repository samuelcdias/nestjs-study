import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"

import { CreateCategoryDto } from "./dtos/create-category.dto"
import { UpdateCategoryDto } from "./dtos/update-category.dto"
import { Category } from "./interfaces/category.interface"
import { PlayersService } from "./../players/players.service"

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel("Category")
        private readonly categoryModel: Model<Category>,
        private readonly playersService: PlayersService
    ) {}

    async createCategory(
        createCategoryDto: CreateCategoryDto
    ): Promise<Category> {
        const { category } = createCategoryDto
        const categoryFound = await this.categoryModel
            .findOne({ category })
            .exec()

        if (categoryFound) {
            throw new BadRequestException(
                `Categoria ${category} já cadastrada!`
            )
        }
        const categoryCreated = new this.categoryModel(createCategoryDto)
        return await categoryCreated.save()
    }

    async getAllCategories(): Promise<Category[]> {
        return await this.categoryModel.find().populate("players").exec()
    }

    async getCategoryById(category: string): Promise<Category> {
        const categoryFound = await this.categoryModel
            .findOne({ category })
            .exec()

        if (!categoryFound) {
            throw new NotFoundException(`Categoria ${category} não encontrada!`)
        }

        return categoryFound
    }

    async updateCategory(
        category: string,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<void> {
        const categoryFound = await this.categoryModel
            .findOne({ category })
            .exec()

        if (!categoryFound) {
            throw new NotFoundException(`Categoria ${category} não encontrada!`)
        }

        await this.categoryModel
            .findOneAndUpdate({ category }, { $set: updateCategoryDto })
            .exec()
    }

    async assignCategoryPlayer(params: string[]): Promise<void> {
        const category = params["category"]
        const idPlayer = params["idPlayer"]

        const categoryFound = await this.categoryModel
            .findOne({ category })
            .exec()

        const playerAlreadyAssignedCategory = await this.categoryModel
            .find({ category })
            .where("players")
            .in(idPlayer)
            .exec()

        await this.playersService.getPlayerById(idPlayer)

        if (!categoryFound) {
            throw new BadRequestException(
                `Categoria ${category} não encontrada!`
            )
        }
        if (playerAlreadyAssignedCategory.length > 0) {
            throw new BadRequestException(
                `Jogador ${idPlayer} já cadastrado na Categoria ${category}`
            )
        }

        categoryFound.players.push(idPlayer)
        await this.categoryModel
            .findOneAndUpdate({ category }, { $set: categoryFound })
            .exec()
    }
}
