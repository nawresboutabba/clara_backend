import { NextFunction } from "express";
import { RequestMiddleware, ResponseMiddleware } from "./middlewares.interface";
import { DateTime } from 'luxon'
export default (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
        const timeZone = req.body.time_zone || DateTime.local().zonaName
        console.log(DateTime.now().toISO())
        req.timeZone = timeZone
        next();
    } catch (error) {
        /**
         * @TODO respose according to convention
         */
        return res.status(401).json({
            message: 'Setting TimeZone'
        });
    }
};