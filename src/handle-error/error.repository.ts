import { LAYERS } from '../constants'

export default class RepositoryError extends Error {
	constructor(title: string, code: number , ...params: any) {
		super(...params)
		if (Error.captureStackTrace) {
			/**
       * this.stack
       */
			Error.captureStackTrace(this, RepositoryError)
		}
		/**
       * Error Title
       */
		this.name = title
		/**
       * Error Layer
       */
		this.layer = LAYERS.REPOSITORY
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