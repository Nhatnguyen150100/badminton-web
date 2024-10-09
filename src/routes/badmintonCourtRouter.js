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
  "/",
  tokenMiddleware.verifyToken,
  badmintonCourtController.getListBadmintonCourt
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
  tokenMiddleware.verifyTokenAdmin,
  badmintonCourtController.changeStatusBadmintonCourt
);

badmintonCourtRouter.delete(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  badmintonCourtController.deleteBadmintonCourt
);

export default badmintonCourtRouter;
