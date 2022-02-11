import {NextFunction, Request, Response} from "express";
import fs from "fs";

const logging = (req: Request, res: Response, next: NextFunction) => {
    let content = '\n' + new Date().toString() + '\n';
    content += req.method + '\n';
    content += req.url + '\n';
    content += req.headers["user-agent"] + '\n';
    content += req.ip + '\n';
    fs.appendFile('./log.txt', content, (err) => {
        if(err) {
            console.log(err);
        }
    });
    next();
}

export default logging;
