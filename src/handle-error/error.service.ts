import { LAYERS } from '../constants'

export default class ServiceError extends Error {
    constructor(title: string, code: number , ...params: any) {
      super(...params)
      if (Error.captureStackTrace) {
        /**
       * this.stack
       */
        Error.captureStackTrace(this, ServiceError)
      }
      /**
       * Error Title
       */
      this.name = title
      /**
       * Error Layer
       */
      this.layer = LAYERS.SERVICE
      /**
       * Error date
       */
      this.date = new Date()
      this.code = code
    }
    public layer:string
    public date: Date
    public code: number
  }