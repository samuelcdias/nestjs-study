import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"

import { ChallengeController } from "./challenge.controller"
import { ChallengeSchema } from "./interface/challenge.schema"
import { ChallengeService } from "./challenge.service"
import { PlayersModule } from "src/players/players.module"
import { CategoriesModule } from "src/categories/categories.module"

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "Challenge", schema: ChallengeSchema },
        ]),
        PlayersModule,
        CategoriesModule,
    ],
    providers: [ChallengeService],
    controllers: [ChallengeController],
})
export class ChallengeModule {}
