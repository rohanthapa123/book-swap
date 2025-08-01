import { Request, Response } from 'express';
import logger from '../utils/logger';
import { BookRecommendationService } from '../services/recommentation.service';

export class RecommendationsController {
    private recommendationService: BookRecommendationService;

    constructor() {
        this.recommendationService = new BookRecommendationService();
    }



    // 📚 Get all recommendations
    getContentBasedRecommendation = async (req: Request, res: Response) => {

        const userId = (req as any).user.id;

        try {
            const recommendations = await this.recommendationService.getContentBasedRecommendations(userId);
            res.status(200).json({ data: recommendations });
        } catch (error: any) {
            logger.error('FindAll Error:', error.message);
            res
                .status(500)
                .json({ message: 'Failed to retrieve recommendations', error: error.message });
        }
    };


}
