const ServiceJob = require('../models/ServiceJob');
const Notification = require('../models/Notification');

let availableBikeSlots = 15; 

// @desc      Get remaining slot configurations
exports.getSlots = (req, res) => {
    res.json({ bikeSlots: availableBikeSlots });
};

// @desc      Submit a bike service request (Creates Admin Radar notification entry)
exports.bookService = async (req, res) => {
    try {
        const { userId, bikeModel, registrationNumber, serviceType, partsToReplace } = req.body;

        if (availableBikeSlots <= 0) {
            return res.status(400).json({ message: "No operational service slots remaining for today." });
        }

        let baseRate = serviceType === 'Full Servicing' ? 120 : 50;
        let partsCost = (partsToReplace || []).length * 35; 
        let totalEstimated = baseRate + partsCost;

        const newJob = new ServiceJob({
            userId,
            vehicleType: 'bike',
            bikeModel,
            registrationNumber,
            serviceType,
            partsToReplace,
            estimatedCost: totalEstimated,
            status: 'Pending'
        });

        await newJob.save();
        availableBikeSlots -= 1;

        // GENERATE ADMIN RADAR SYSTEM NOTIFICATION
        const adminAlert = new Notification({
            recipientId: 'admin',
            title: 'New Dispatch Logged',
            message: `New request received for vehicle model ${bikeModel} [Reg No: ${registrationNumber}]`,
            jobId: newJob._id,
            isRead: false // Explicitly enforce unread status
        });
        await adminAlert.save();

        res.status(201).json({ message: "Maintenance booking dispatched successfully!", job: newJob });
    } catch (err) {
        res.status(500).json({ message: "Booking rejected.", error: err.message });
    }
};

// @desc      Fetch specific user tracking records
exports.getUserJobs = async (req, res) => {
    try {
        const jobs = await ServiceJob.find({ userId: req.params.userId, vehicleType: 'bike' }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc      Fetch all incoming bike service records for Admin panel view
exports.getAllBikeJobs = async (req, res) => {
    try {
        const jobs = await ServiceJob.find({ vehicleType: 'bike' }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc      Admin transitions booking status (Generates user custom alert loops text parameters)
exports.updateJobStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const jobId = req.params.id;

        const updatedJob = await ServiceJob.findById(jobId);
        if (!updatedJob) return res.status(404).json({ message: "Service job instance not resolved." });

        updatedJob.status = status;
        if (adminNotes !== undefined) updatedJob.adminNotes = adminNotes;
        await updatedJob.save();

        // CONFIGURE TARGETED USER ALERT PAYLOAD TRANSITIONS
        let textPrompt = `Your vehicle ${updatedJob.bikeModel} state updated to: ${status.toUpperCase()}.`;
        
        if (status === 'To Do') {
            textPrompt = `Admin has accepted your request. Your bike ${updatedJob.bikeModel} [Reg: ${updatedJob.registrationNumber}] is placed in queue (TO DO).`;
        } else if (status === 'In Progress') {
            textPrompt = `Your bike service for ${updatedJob.bikeModel} (${updatedJob.registrationNumber}) is now IN PROGRESS in the service bay.`;
        } else if (status === 'In Review') {
            textPrompt = `Quality check active. Your vehicle ${updatedJob.bikeModel} is under final testing and evaluation (IN REVIEW).`;
        } else if (status === 'Done') {
            textPrompt = `Great news! Your bike service for ${updatedJob.bikeModel} is complete and ready for pickup.`;
        }

        const userNotification = new Notification({
            recipientId: updatedJob.userId,
            title: `Job Phase: ${status}`,
            message: textPrompt,
            jobId: updatedJob._id,
            isRead: false
        });
        await userNotification.save();

        res.status(200).json({ message: `Status updated successfully to ${status}!`, job: updatedJob });
    } catch (err) {
        res.status(500).json({ message: "Failed to modify structural status nodes.", error: err.message });
    }
};

/* ==========================================================================
   NOTIFICATION SYSTEM CONTROLLERS
   ========================================================================== */

// @desc      Fetch live unread notification payloads matching recipient filters
exports.getNotifications = async (req, res) => {
    try {
        const queryTarget = req.params.recipientId; 
        const notifications = await Notification.find({ recipientId: queryTarget }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc      Mark single message notification as read
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: "Notification flag marked read successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc      Clear all notification maps completely matching recipient context
exports.clearAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipientId: req.params.recipientId });
        res.json({ message: "Notification terminal cleared down successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};