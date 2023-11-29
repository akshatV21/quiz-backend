import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { UpdateQuery } from 'mongoose'
import { PracticeResultDocument, Question } from 'src/database/models'
import { PracticeResultRepository, SetRepository } from 'src/database/repositories'
import { PracticeResultInfo } from 'src/utils/interfaces'

@Injectable()
export class PracticeResultManager {
  private results: Map<string, PracticeResultInfo>

  constructor(
    private readonly SetRepository: SetRepository,
    private readonly PracticeResultRepository: PracticeResultRepository,
  ) {
    this.results = new Map<string, PracticeResultInfo>()
  }

  register(userId: string, resultId: string, setId: string) {
    this.results.set(userId, { resultId, options: new Array(10).fill(-1), setId, startTime: null })
  }

  selectOption(userId: string, questionIndex: number, optionIndex: number) {
    this.results.get(userId).options[questionIndex] = optionIndex
  }

  isRegistered(userId: string) {
    return this.results.has(userId)
  }

  setStartTime(userId: string) {
    this.results.get(userId).startTime = Date.now()
  }

  async submit(userId: string) {
    try {
      const resultInfo = this.results.get(userId)

      const set = await this.SetRepository.findById(
        resultInfo.setId,
        { questions: 1 },
        { lean: true, populate: { path: 'questions', select: 'options answer' } },
      )

      const { correct, skipped } = this.getCorrectAndSkippedCount(set.questions as Question[], resultInfo.options)

      const updateQuery: UpdateQuery<PracticeResultDocument> = {
        $push: { 'options.selected': { $each: resultInfo.options } },
        $inc: { 'options.correct': correct, 'options.skipped': skipped },
        $set: { 'time.start': resultInfo.startTime, 'time.end': Date.now() },
      }

      const result = await this.PracticeResultRepository.update(resultInfo.resultId, updateQuery)
      this.results.delete(userId)

      return result
    } catch (error) {
      throw new WsException('Error while submitting practice result.')
    }
  }

  async cancel(userId: string) {
    try {
      const resultInfo = this.results.get(userId)

      this.results.delete(userId)
      await this.PracticeResultRepository.delete({ id: resultInfo.resultId })
    } catch (error) {
      throw new WsException('Error while deleting practice result.')
    }
  }

  private getCorrectAndSkippedCount(questions: Question[], options: number[]) {
    let correct = 0
    let skipped = 0

    for (let i = 0; i < questions.length; i++) {
      if (options[i] === -1) skipped++
      else if (questions[i].options[options[i]] === questions[i].answer) correct++
    }

    return { correct, skipped }
  }
}
