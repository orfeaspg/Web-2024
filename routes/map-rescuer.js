import {
    Users,
    Announcements,
    Products,
    Tasks,
    Categories,
    WarehouseProducts,
    Vehicles
} from '../schemas.js';

export default function mapRescuerRoutes(app) {
    // Get data for the map display
    app.get('/map-rescuer-data', async (req, res) => {
        // Check if user is logged in
        if (!req.session.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const rescuerId = req.session.user._id;  // Access the user ID from the session user object

        try {
            // Fetch the warehouse location
            const warehouse = await Users.findOne({ role: 'admin' }).select('location');

            // Fetch the rescuer's vehicle and its data
            const vehicle = await Vehicles.findOne({ rescuer_id: rescuerId })
                .populate('rescuer_id', 'location')
                .populate('cargo.product_id', 'name')
                .populate('task_ids', 'type status');

            // Fetch tasks that are either assigned to the current rescuer or are pending and unassigned
            const tasks = await Tasks.find({
                $or: [
                    { rescuer_id: rescuerId },
                    { rescuer_id: null, status: 'pending' }
                ]
            })
                .populate('citizen_id', 'name surname phone_number location')
                .populate('product_id', 'name');

            res.json({
                vehicle,
                tasks,
                warehouse
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

    // Update the location of the rescuer (vehicle)
    app.put('/update-rescuer-location', async (req, res) => {
        // Check if user is logged in
        if (!req.session.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const rescuerId = req.session.user._id;  // Access the user ID from the session user object

        try {
            const { latitude, longitude } = req.body;

            await Vehicles.findOneAndUpdate({ rescuer_id: rescuerId }, {
                location: {
                    latitude,
                    longitude
                }
            });

            res.json({
                message: 'Rescuer location updated successfully'
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

    // Claim a task
    app.put('/claim-task', async (req, res) => {
        // Check if user is logged in
        if (!req.session.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const rescuerId = req.session.user._id;  // Access the user ID from the session user object
        const taskId = req.body.taskId;

        try {
            // Ensure that the task exists and has not been claimed by another rescuer
            const task = await Tasks.findOne({ _id: taskId, rescuer_id: null });

            if (!task) {
                return res.status(404).json({ message: 'Task not found or already claimed' });
            }

            // Update the task to assign it to the rescuer
            await Tasks.findByIdAndUpdate(taskId, { rescuer_id: rescuerId, assignedAt: new Date() });

            res.json({
                message: 'Task claimed successfully'
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
}