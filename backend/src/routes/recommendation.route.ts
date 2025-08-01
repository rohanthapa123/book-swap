import express from 'express';
import { RecommendationsController } from '../controller/recommendation.controller';
import { authenticate } from '../middlewares/authMiddleware';

const controller = new RecommendationsController();

const router = express.Router();

router.get('/content', authenticate, controller.getContentBasedRecommendation);
// router.get('/:slug', controller.findBySlug);
// router.delete('/:id', authenticate, controller.delete);
// router.put('/:id', authenticate, controller.update);

export { router as recommendationRouter };

