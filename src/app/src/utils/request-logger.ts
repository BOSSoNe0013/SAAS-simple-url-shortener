import { Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

const getResponseLog = (res: Response) => {
    const logger = new Logger("Response")
    const rawResponse = res.write;
    const rawResponseEnd = res.end;
    const chunkBuffers = [];
    res.write = (...chunks) => {
        const resArgs = [];
        for (let i = 0; i < chunks.length; i++) {
            resArgs[i] = chunks[i];
            if (!resArgs[i]) {
                res.once('drain', res.write);
                i--;
            }
        }
        if (resArgs[0]) {
            chunkBuffers.push(Buffer.from(resArgs[0]));
        }
        return rawResponse.apply(res, resArgs);
    };
    logger.log(`Done writing, beginning res.end`);
    res.end = (...chunk) => {
        const resArgs = [];
        for (let i = 0; i < chunk.length; i++) {
            resArgs[i] = chunk[i];
        }
        if (resArgs[0]) {
            chunkBuffers.push(Buffer.from(resArgs[0]));
        }
        const body = Buffer.concat(chunkBuffers).toString('utf8');
        let message;
        try {
            message = JSON.parse(body);
        } catch {
            message = body || {};
        }
        finally {
            const responseLog = {
                response: {
                    statusCode: res.statusCode,
                    body:  message,
                    // Returns a shallow copy of the current outgoing headers
                    headers: res.getHeaders(),
                },
            };
            logger.log(responseLog);
            rawResponseEnd.apply(res, resArgs);
            return responseLog as unknown as Response;
        }
    };
};

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger("Request")
    logger.log({
      headers: req.headers,
      body: req.body,
      originalUrl: req.originalUrl,
    });
    getResponseLog(res);
    if(next) {
        next();
    }
}