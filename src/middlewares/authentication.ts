import { verify } from 'jsonwebtoken'
import { NextFunction} from "express"
import { RequestMiddleware, ResponseMiddleware } from "./middlewares.interface";

export default (req: RequestMiddleware, res: ResponseMiddleware, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        /**
         * @TODO respose according to convention
         */
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};