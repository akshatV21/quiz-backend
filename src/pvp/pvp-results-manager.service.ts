import { PvpResultInfo, PvpResultRegisterInfo } from 'src/utils/interfaces'

export class PvpResultManager {
  private waiting: PvpResultInfo[]
  private results: Map<string, PvpResultInfo>

  constructor() {
    this.waiting = []
    this.results = new Map()
  }

  register(data: PvpResultRegisterInfo) {
    const { userId, resultId, setId, topic } = data
    const waitingIndex = this.waiting.findIndex(result => result.topic === topic)

    if (waitingIndex === -1) {
      const newResult: PvpResultInfo = {
        setId,
        topic,
        userIds: [userId],
        users: { [userId]: { id: resultId, options: [], time: 0 } },
        winner: null,
      }

      this.waiting.push(newResult)
    } else {
      const result = this.waiting[waitingIndex]

      result.userIds.push(userId)
      result.users[userId] = { id: resultId, options: [], time: 0 }

      this.waiting.splice(waitingIndex, 1)
      this.results.set(result.setId, result)
    }
  }
}
