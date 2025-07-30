import { Request, Response } from 'express';
import { EventService } from '../services/book.service';
import { UserService } from '../services/user.service';
import logger from '../utils/logger';

export class EventsRegisterController {
    private eventService: EventService;
    private userService: UserService;

    constructor() {
        this.eventService = new EventService();
        this.userService = new UserService();
    }

    // 📥 Create event
    registerEvent = async (req: Request, res: Response) => {

        console.log(req)
        const userId = (req as any).user.id;


        const eventId = req.params.id; // Make sure you're using /registerEvent/:id route

        console.log(userId, eventId)
        try {
            const user = await this.userService.findById(userId);
            const event = await this.eventService.findById(eventId);

            if (!user || !event) {
                res.status(404).json({ message: 'User or Event not found' });
                return;
            }

            // Initialize registeredEvents if not set
            if (!user.registeredEvents) {
                user.registeredEvents = [];
            }

            // Avoid duplicate registrations
            const alreadyRegistered = user.registeredEvents.some(e => e.id === event.id);
            if (alreadyRegistered) {
                res.status(400).json({ message: 'Already registered for this event' });
                return;
            }

            user.registeredEvents.push(event);

            const updatedUser = await this.userService.update(userId, user);

            res.status(200).json({ message: 'Successfully registered for event', data: updatedUser });
        } catch (error: any) {
            logger.error('Register Event Error:', error.message);
            res.status(500).json({ message: 'Failed to register for event', error: error.message });
        }
    };


}