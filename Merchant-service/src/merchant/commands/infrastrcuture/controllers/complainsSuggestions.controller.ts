import joi from 'joi';

import { UNPROCESSABLE_ENTITY, CREATED, OK } from 'http-status';
import { createComplain, complainsStatus } from '../../application/usecases/complainsSuggestions.service';

const mapComplainStatus = complainStatus => {
  switch (complainStatus) {
    case complainsStatus.COMPLAIN_CREATED:
      return CREATED;
    default:
      return OK;
  }
};

/**
 * @swagger
 * /api/complains-suggestions
 *   post:
 *     description: Add complain or suggestion.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: type
 *         description: the type can be a "complain" or a "suggestion".
 *         in: body
 *         required: true
 *         type: string
 *       - name: complainReason
 *         description: the number of the complain reason (If the type is "complain").
 *         in: body
 *         required: false
 *         type: number
 *       - name: suggestionSection
 *         description: the number of the suggestion section (If the type is "suggestion").
 *         in: body
 *         required: false
 *         type: number
 *       - name: details
 *         description: Info and details about the complain or the suggestion.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       422
 *        description: The request could not be understood by the server due to malformed syntax.
 *       201
 *        description: Complain created.
 */
export const createComplainOrSuggestion = async (req, res) => {
  const schema = joi.object({
    type: joi.string().required(),
    complainReason: joi
      .number()
      .optional()
      .allow('', null),
    suggestionSection: joi
      .number()
      .optional()
      .allow('', null),
    details: joi.string().required(),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
  }
  const { status } = await createComplain({
    ...body,
    TagerID: req.decodedToken.user.TagerID,
  });
  return res.status(mapComplainStatus(status)).json({ msg: 'Complain Created Successfully' });
};


