import express from 'express';
import type { Response } from 'express';
import Task from '../models/taskModel.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply middleware to all task routes
router.use(authMiddleware);

// @route   GET api/tasks
// @desc    Get all tasks for a user
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const tasks = await Task.find({ userId });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route   POST api/tasks
// @desc    Create a task
router.post('/', async (req: AuthRequest, res: Response) => {
    const { title, description, dateTime, deadline, priority } = req.body;

    try {
        const newTask = new Task({
            userId: req.user?.id,
            title,
            description,
            dateTime,
            deadline,
            priority,
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
router.put('/:id', async (req: AuthRequest, res: Response) => {
    const { title, description, dateTime, deadline, priority, isCompleted } = req.body;

    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Make sure user owns task
        if (task.userId.toString() !== req.user?.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, dateTime, deadline, priority, isCompleted } },
            { new: true }
        );

        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Make sure user owns task
        if (task.userId.toString() !== req.user?.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({ message: 'Task removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

export default router;
