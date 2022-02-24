import { LAYERS } from '../constants'

export default class RoutingError extends Error {
	constructor(title: string, code: number , sanitizationDescription?: any, ...params: any) {
		super(...params)
		if (Error.captureStackTrace) {
			/**
       * this.stack
       */
			Error.captureStackTrace(this, RoutingError)
		}
		/**
       * Error Title
       */
		this.name = title
		/**
       * Error Layer
       */
		this.layer = LAYERS.ROUTING
		/**
       * Error date
       */
		this.date = new Date()
		this.code = code
		this.sanitizationDescription = sanitizationDescription
	}
	public layer:string
	public date: Date
	public code: number
	public sanitizationDescription: any
}