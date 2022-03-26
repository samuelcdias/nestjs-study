import { Result } from "./../interface/challenge.interface"
import { Player } from "../../players/interfaces/player.interface"
import { IsNotEmpty } from "class-validator"

export class AttachChallengeGameDto {
    @IsNotEmpty()
    def: Player

    @IsNotEmpty()
    result: Result[]
}
