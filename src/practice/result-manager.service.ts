import { Injectable } from '@nestjs/common'
import { PracticeResultInfo } from 'src/utils/interfaces'

@Injectable()
export class PracticeResultManager {
  private results: Map<string, PracticeResultInfo>

  constructor() {
    this.results = new Map<string, PracticeResultInfo>()
  }

  register(userId: string, setId: string) {
    this.results.set(userId, { resultId: setId, options: new Array(10).fill(-1) })
  }
}
