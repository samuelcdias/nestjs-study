import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsNotEmpty,
} from "class-validator"
import { Player } from "src/players/interfaces/player.interface"

export class CreateChallengeDto {
    @IsNotEmpty()
    @IsDateString()
    dateTimeChallenge: Date

    @IsNotEmpty()
    requester: Player

    @IsArray()
    @ArrayMaxSize(2)
    @ArrayMinSize(2)
    players: Array<Player>
}
