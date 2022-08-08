import express from 'express';
import isAuthenticated from '../middlewares/auth';
import IsQuestionnaireEnabledController from '../engagement/questionnaires/queries/infrastructure/controllers/IsQuestionnaireEnabledController';
import { registerGet, registerPost } from '../common/http/HttpHandler';
import GetQuestionnaireController from '../engagement/questionnaires/queries/infrastructure/controllers/GetQuestionnaireController';
import SubmitQuestionnaireAnswerController from '../engagement/questionnaires/commands/infrastructure/controllers/SubmitQuestionnaireAnswerController';
import DeclineQuestionnaireController from '../engagement/questionnaires/commands/infrastructure/controllers/DeclineQuestionnaireController';

const router = express.Router();

registerGet('/:questionnaireName/is-enabled', IsQuestionnaireEnabledController, router, isAuthenticated);
registerGet('/:questionnaireName', GetQuestionnaireController, router, isAuthenticated);
registerPost('/:questionnaireName/answers', SubmitQuestionnaireAnswerController, router, isAuthenticated);
registerPost('/:questionnaireName/decline', DeclineQuestionnaireController, router, isAuthenticated);

export = router;


