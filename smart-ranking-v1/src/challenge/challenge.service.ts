import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"

import { Challenge, Game } from "./interface/challenge.interface"
import { AttachChallengeGameDto } from "./dtos/attach-challenge-game.dto"
import { CreateChallengeDto } from "./dtos/create-challenge.dto"
import { UpdateChallengeDto } from "./dtos/update-challenge.dto"
import { PlayersService } from "./../players/players.service"
import { CategoriesService } from "./../categories/categories.service"
import { ChallengeStatus } from "./interface/challenge-status.enum"

@Injectable()
export class ChallengeService {
    constructor(
        @InjectModel("Challenge")
        private readonly challengeModel: Model<Challenge>,
        @InjectModel("Game")
        private readonly gameModel: Model<Game>,
        private readonly playersService: PlayersService,
        private readonly categoriesService: CategoriesService
    ) {}

    async createChallenge(createChallengeDto: CreateChallengeDto) {
        const players = await this.playersService.getAllPlayers()
        createChallengeDto.players.map((playerDto) => {
            const playerFilter = players.filter(
                (player) => String(player._id) === String(playerDto._id)
            )
            if (playerFilter.length == 0) {
                throw new BadRequestException(
                    `O id ${playerDto._id} não é um jogador`
                )
            }
        })

        const isRequesterInPlayers = createChallengeDto.players.find(
            (player) =>
                String(createChallengeDto.requester._id) === String(player._id)
        )
        if (!isRequesterInPlayers) {
            throw new BadRequestException(
                `O solicitante precisa de ser um dos jogadores da partida!`
            )
        }

        const categories = await this.categoriesService.getAllCategories()
        const RequesterCategory = categories.find((category) => {
            return category.players.find(
                (player) =>
                    String(player._id) ===
                    String(createChallengeDto.requester._id)
            )
        })
        if (!RequesterCategory) {
            throw new BadRequestException(
                `Desafiador precisa de estar cadastrado em um categoria`
            )
        }

        const challengeCreated = new this.challengeModel(createChallengeDto)
        challengeCreated.category = RequesterCategory.description
        challengeCreated.dateTimeRequest = new Date()
        challengeCreated.status = ChallengeStatus.PENDENTE

        return await challengeCreated.save()
    }

    async attachChallengeGame(
        _id: string,
        attachChallengeGameDto: AttachChallengeGameDto
    ): Promise<void> {
        const challengeFound = await this.challengeModel.findById(_id).exec()

        if (!challengeFound) {
            throw new BadRequestException(`Desafio ${_id} não encontrado!`)
        }

        const playerFilter = challengeFound.players.filter(
            (player) => player.id == attachChallengeGameDto.def
        )

        if (playerFilter.length == 0) {
            throw new BadRequestException(
                "O jogador vencedor não faz parte do desafio"
            )
        }

        const gameCreated = new this.gameModel(attachChallengeGameDto)

        gameCreated.category = challengeFound.category
        gameCreated.players = challengeFound.players

        const result = await gameCreated.save()

        challengeFound.status = ChallengeStatus.REALIZADO
        challengeFound.game = result._id

        try {
            await this.challengeModel
                .findOneAndUpdate({ _id }, { $set: challengeFound })
                .exec()
        } catch (error) {
            await this.challengeModel.deleteOne({ _id: result._id }).exec()
            throw new InternalServerErrorException()
        }
    }

    async updateChallenge(
        _id: string,
        updateChallengeDto: UpdateChallengeDto
    ): Promise<void> {
        const challengeFound = await this.challengeModel.findOne({ _id }).exec()
        if (!challengeFound) {
            throw new NotFoundException(`Desafio com id ${_id} não encontrado`)
        }

        if (updateChallengeDto.status) {
            challengeFound.dateTimeResponse = new Date()
        }
        challengeFound.status = updateChallengeDto.status
        challengeFound.dateTimeChallenge = updateChallengeDto.dateTimeChallenge

        await this.challengeModel
            .findOneAndUpdate({ _id: _id }, { $set: challengeFound })
            .exec()
    }

    async getAllChallenges(): Promise<Challenge[]> {
        return await this.challengeModel
            .find()
            .populate("players")
            .populate("requester")
            .populate("game")
            .exec()
    }

    async getChallengeById(_id: string): Promise<Challenge> {
        const challengeFound = await this.challengeModel.findOne({ _id }).exec()
        if (!challengeFound) {
            throw new NotFoundException(`Desafio com id ${_id} não encontrado`)
        }
        return challengeFound
    }

    async getChallengeByPlayer(_id: string): Promise<Challenge[]> {
        const player = await this.playersService.getPlayerById(_id)
        const challengesFound = await this.challengeModel
            .find({
                players: player._id,
            })
            .populate("players")
            .populate("requester")
            .populate("game")
            .exec()
        return challengesFound
    }

    async deleteChallenge(_id: string): Promise<any> {
        const challengeFound = await this.challengeModel.findOne({ _id }).exec()
        if (!challengeFound) {
            throw new NotFoundException(`Desafio com id ${_id} não encontrado`)
        }
        challengeFound.status = ChallengeStatus.CANCELADO
        await this.challengeModel
            .findOneAndUpdate({ _id: _id }, { $set: challengeFound })
            .exec()
    }
}
