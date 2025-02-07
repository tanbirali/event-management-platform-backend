const express = require("express");

const { eventController } = require("../controller");
const { authMiddleware, uploadMiddleware } = require("../middleware");
const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  uploadMiddleware.single("media"),
  eventController.createEvent
);

router.get("/", eventController.getEvents);

router.get("/user", authMiddleware, eventController.getUserEvents);

router.get("/:id", eventController.getEventById);

router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware.single("media"),
  eventController.updateEvent
);

router.delete("/:id", authMiddleware, eventController.deleteEvent);

router.post("/:id/attend", authMiddleware, eventController.attendEvent);

module.exports = router;
