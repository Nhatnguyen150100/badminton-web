"use-strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware";
import badmintonCourtController from "../controllers/badmintonCourtController";
import badmintonCourtMiddleware from "../middleware/badmintonCourtMiddleware";
const badmintonCourtRouter = express.Router();

badmintonCourtRouter.post(
  "/",
  tokenMiddleware.verifyToken,
  badmintonCourtController.createBadmintonCourt
);

badmintonCourtRouter.get(
  "/:id",
  tokenMiddleware.verifyToken,
  badmintonCourtController.getBadmintonCourt
);

badmintonCourtRouter.put(
  "/:id",
  tokenMiddleware.verifyToken,
  badmintonCourtMiddleware.checkCourtOwner,
  badmintonCourtController.updateBadmintonCourt
);

badmintonCourtRouter.put(
  "/status/:id",
  tokenMiddleware.verifyToken,
  badmintonCourtMiddleware.checkCourtOwner,
  badmintonCourtController.updateBadmintonCourt
);

badmintonCourtRouter.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  badmintonCourtMiddleware.checkCourtOwner,
  badmintonCourtController.deleteBadmintonCourt
);


export default badmintonCourtRouter;