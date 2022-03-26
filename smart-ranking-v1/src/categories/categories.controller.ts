import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common"

import { CategoriesService } from "./categories.service"
import { Category } from "./interfaces/category.interface"
import { CreateCategoryDto } from "./dtos/create-category.dto"
import { UpdateCategoryDto } from "./dtos/update-category.dto"

@Controller("api/v1/categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto
    ): Promise<Category> {
        return await this.categoriesService.createCategory(createCategoryDto)
    }

    @Get()
    async getCategories(): Promise<Category[]> {
        return await this.categoriesService.getAllCategories()
    }

    @Get("/:category")
    async getCategoryById(
        @Param("category") category: string
    ): Promise<Category> {
        return await this.categoriesService.getCategoryById(category)
    }

    @Put("/:category")
    @UsePipes(ValidationPipe)
    async updateCategory(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Param("category") category: string
    ): Promise<void> {
        await this.categoriesService.updateCategory(category, updateCategoryDto)
    }

    @Post("/:category/players/:idPlayer")
    async assignCategoryPlayer(@Param() params: string[]): Promise<void> {
        await this.categoriesService.assignCategoryPlayer(params)
    }
}
