import { Request, Response } from 'express';
import { BookApprovalRequestService } from '../services/bookApprovalRequest.service';
import logger from '../utils/logger';

export class BookApprovalRequestController {
    private approvalService: BookApprovalRequestService;

    constructor() {
        this.approvalService = new BookApprovalRequestService();
    }

    create = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const newApproval = await this.approvalService.create(data);
            res.status(201).json({ message: 'Swap approval request created successfully', data: newApproval });
        } catch (error: any) {
            logger.error('Create Swap Approval Request Error:', error.message);
            res.status(500).json({ message: 'Failed to create approval request', error: error.message });
        }
    };

    findPending = async (req: Request, res: Response) => {
        try {
            const pending = await this.approvalService.findPending();
            res.status(200).json({ data: pending });
        } catch (error: any) {
            logger.error('Find Pending Swap Approval Requests Error:', error.message);
            res.status(500).json({ message: 'Failed to retrieve pending approvals', error: error.message });
        }
    };

    updateStatus = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const { status, adminNote } = req.body;

            if (!['approved', 'rejected'].includes(status)) {
                res.status(400).json({ message: 'Invalid status value' });
                return;
            }

            const updated = await this.approvalService.updateStatus(id, status, adminNote);
            res.status(200).json({ message: 'Status updated', data: updated });
        } catch (error: any) {
            logger.error('Update Swap Approval Status Error:', error.message);
            res.status(500).json({ message: 'Failed to update status', error: error.message });
        }
    };

    findByBookId = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const approval = await this.approvalService.findByBookId(id);
            res.status(200).json({ data: approval });
        } catch (error: any) {
            logger.error('Find Swap Approval Request By ID Error:', error.message);
            res.status(404).json({ message: 'Approval request not found', error: error.message });
        }
    };
}
