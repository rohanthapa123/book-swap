import { Request, Response } from 'express';
import { SwapRequestService } from '../services/swapRequest.service';
import logger from '../utils/logger';

export class SwapRequestController {
    private swapRequestService: SwapRequestService;

    constructor() {
        this.swapRequestService = new SwapRequestService();
    }

    create = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const requesterId = (req as any)?.user?.id;
            const newRequest = await this.swapRequestService.create(data, requesterId);
            res.status(201).json({ message: 'Swap request created successfully', data: newRequest });
        } catch (error: any) {
            logger.error('Create Swap Request Error:', error.message);
            res.status(500).json({ message: 'Failed to create swap request', error: error.message });
        }
    };

    findAll = async (_req: Request, res: Response) => {
        try {
            const requests = await this.swapRequestService.findAll();
            res.status(200).json({ data: requests });
        } catch (error: any) {
            logger.error('Find All Swap Requests Error:', error.message);
            res.status(500).json({ message: 'Failed to retrieve swap requests', error: error.message });
        }
    };

    findAllRelatedToMe = async (_req: Request, res: Response) => {
        try {
            const id = (_req as any)?.user?.id;
            const requests = await this.swapRequestService.findAllRelatedToMe(id);
            res.status(200).json({ data: requests });
        } catch (error: any) {
            logger.error('Find All Swap Requests Error:', error.message);
            res.status(500).json({ message: 'Failed to retrieve swap requests', error: error.message });
        }
    };

    findById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const request = await this.swapRequestService.findById(id);
            res.status(200).json({ data: request });
        } catch (error: any) {
            logger.error('Find Swap Request By ID Error:', error.message);
            res.status(404).json({ message: 'Swap request not found', error: error.message });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const updatedRequest = await this.swapRequestService.update(id, data);
            res.status(200).json({ message: 'Swap request updated successfully', data: updatedRequest });
        } catch (error: any) {
            logger.error('Update Swap Request Error:', error.message);
            res.status(500).json({ message: 'Failed to update swap request', error: error.message });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            await this.swapRequestService.delete(id);
            res.status(200).json({ message: 'Swap request deleted successfully' });
        } catch (error: any) {
            logger.error('Delete Swap Request Error:', error.message);
            res.status(500).json({ message: 'Failed to delete swap request', error: error.message });
        }
    };

    // ✅ Accept Swap Request
    accept = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const result = await this.swapRequestService.updateStatus(id, 'accepted');
            res.status(200).json({ message: 'Swap request accepted', data: result });
        } catch (error: any) {
            logger.error('Accept Swap Request Error:', error.message);
            res.status(500).json({ message: 'Failed to accept swap request', error: error.message });
        }
    };

    // ❌ Reject Swap Request
    reject = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const result = await this.swapRequestService.updateStatus(id, 'rejected');
            res.status(200).json({ message: 'Swap request rejected', data: result });
        } catch (error: any) {
            logger.error('Reject Swap Request Error:', error.message);
            res.status(500).json({ message: 'Failed to reject swap request', error: error.message });
        }
    };

    // 🔁 Cancel Swap Request
    cancel = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const result = await this.swapRequestService.updateStatus(id, 'cancelled');
            res.status(200).json({ message: 'Swap request cancelled', data: result });
        } catch (error: any) {
            logger.error('Cancel Swap Request Error:', error.message);
            res.status(500).json({ message: 'Failed to cancel swap request', error: error.message });
        }
    };
}
