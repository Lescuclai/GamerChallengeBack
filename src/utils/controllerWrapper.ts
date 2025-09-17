import type { Request, Response, NextFunction, RequestHandler } from "express";

export function controllerWrapper(mdw: RequestHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await mdw(req, res, next);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Unexpected server error. Please try again later.",
            });
        }
    };
}
