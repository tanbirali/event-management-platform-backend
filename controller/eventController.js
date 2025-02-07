const { cloudinary } = require("../config");
const { updateAttendeeCount } = require("../config/websocket");
const { eventsModel } = require("../models/");

exports.createEvent = async (req, res) => {
  try {
    const { title, category, venue, date } = req.body;
    const mediaUrl = req.file ? req.file.path : null;
    const event = await eventsModel.create({
      title,
      date: new Date(date),
      category,
      venue,
      mediaUrl,
      createdBy: req.user.userId,
    });
    res.status(201).json(event);
  } catch (error) {
    console.log("An Error occured while creating an event: ", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserEvents = async (req, res) => {
  try {
    const events = await eventsModel.find({ createdBy: req.user.userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Events with Filtering (category, past, upcoming)
exports.getEvents = async (req, res) => {
  try {
    const { category, status } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (status === "past") filter.date = { $lt: new Date() };
    if (status === "upcoming") filter.date = { $gte: new Date() };

    const events = await eventsModel
      .find(filter)
      .populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Event
exports.getEventById = async (req, res) => {
  try {
    const event = await eventsModel
      .findById(req.params.id)
      .populate("createdBy", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, date } = req.body;

    //Find the event and check for ownership
    const event = await eventsModel.findById(id);
    if (!event || event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    //Handle the media upload if a new file is provided
    let mediaUrl = event.mediaUrl;
    if (req.file) {
      const uploadedMedia = await cloudinary.uploader.upload(req.file.path);
      mediaUrl = uploadedMedia.secure_url;
    }

    //Update the event
    const updatedEvent = await eventsModel.findByIdAndUpdate(
      id,
      {
        title,
        category,
        date: new Date(date),
        mediaUrl,
      },
      {
        new: true,
      }
    );

    res.json(updatedEvent);
  } catch (error) {
    console.log("An error occured while updating the event", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await eventsModel.findById(id);
    if (!event || event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.attendEvent = async (req, res) => {
  try {
    const event = await eventsModel.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.attendees.includes(req.user._id)) {
      event.attendees.push(req.user._id);
    } else {
      event.attendees = event.attendees.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    }

    await event.save();
    updateAttendeeCount(event._id.toString(), event.attendees.length);

    res.json({
      message: "Attendance updated",
      attendees: event.attendees.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
