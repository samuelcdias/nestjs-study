import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { PlayersModule } from "./players/players.module"
import { CategoriesModule } from "./categories/categories.module"
import { ChallengeModule } from "./challenge/challenge.module"

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_DSN, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }),
        PlayersModule,
        CategoriesModule,
        ChallengeModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
