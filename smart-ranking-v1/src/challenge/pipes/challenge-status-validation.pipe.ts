import { ChallengeStatus } from "./../interface/challenge-status.enum"
import { PipeTransform, BadRequestException } from "@nestjs/common"

export class ChallengeValidationPipe implements PipeTransform {
    readonly acceptedStatus = [
        ChallengeStatus.ACEITO,
        ChallengeStatus.NEGADO,
        ChallengeStatus.CANCELADO,
    ]

    transform(value: any) {
        const status = value.status.toUpperCase()

        if (!this.isValidStatus(status)) {
            throw new BadRequestException(`${status} é um status inválido`)
        }

        return value
    }

    private isValidStatus(status: any) {
        const idx = this.acceptedStatus.indexOf(status)
        return idx !== -1
    }
}
