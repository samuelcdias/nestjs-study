import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common"

import { Challenge } from "./interface/challenge.interface"
import { ChallengeService } from "./challenge.service"
import { AttachChallengeGameDto } from "./dtos/attach-challenge-game.dto"
import { CreateChallengeDto } from "./dtos/create-challenge.dto"
import { UpdateChallengeDto } from "./dtos/update-challenge.dto"
import { ValidationParamsPipe } from "../common/pipes/validation-params.pipe"
import { ChallengeValidationPipe } from "./pipes/challenge-status-validation.pipe"

@Controller("api/v1/challenges")
export class ChallengeController {
    constructor(private readonly challengeService: ChallengeService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async CreateChallenge(
        @Body() createChallengeDto: CreateChallengeDto
    ): Promise<void> {
        await this.challengeService.createChallenge(createChallengeDto)
    }

    @Post("/challenge/game/")
    async attachChallengeGame(
        @Body(ValidationPipe) attachChallengeGameDto: AttachChallengeGameDto,
        @Param("challenge") _id: string
    ): Promise<void> {
        return await this.challengeService.attachChallengeGame(
            _id,
            attachChallengeGameDto
        )
    }

    @Put("/:idChallenge")
    async updatePlayer(
        @Body(ChallengeValidationPipe) updateChallengeDto: UpdateChallengeDto,
        @Param("idChallenge") _id: string
    ): Promise<void> {
        await this.challengeService.updateChallenge(_id, updateChallengeDto)
    }

    @Get("/:_id")
    async getChallengeById(
        @Param("_id", ValidationParamsPipe) _id: string
    ): Promise<Challenge> {
        return await this.challengeService.getChallengeById(_id)
    }

    @Get()
    async getChallenges(@Query("idPlayer") _id: string): Promise<Challenge[]> {
        return _id
            ? await this.challengeService.getChallengeByPlayer(_id)
            : await this.challengeService.getAllChallenges()
    }

    @Delete("/:_id")
    async deleteChallenge(
        @Param("_id", ValidationParamsPipe) _id: string
    ): Promise<void> {
        await this.challengeService.deleteChallenge(_id)
    }
}
