import {NextFunction, Request, Response} from "express";

export const tokens: string[] = [];

const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'] as string;
    if(!tokens.includes(header) || !header) {
        res
            .status(400)
            .json({ message: 'You need authorization!' });
        return;
    }
    next();
}

export default checkToken;
