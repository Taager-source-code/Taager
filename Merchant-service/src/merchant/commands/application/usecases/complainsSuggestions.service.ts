import ComplainRepository from '../../infrastrcuture/repositories/complainSuggestion.repository';

const complainRepositoryInstance = new ComplainRepository();

export const complainsStatus = Object.freeze({
  COMPLAIN_CREATED: 'complain_created',
});

export const createComplain = async complain => {
  const { type, complainReason, suggestionSection, details, TagerID } = complain;

  const complainDocument: {
    type?: string;
    suggestionSection?: any;
    complainReason?: any;
    details?: any;
    TagerID?: number;
  } = {};

  if (type === 'complain') {
    complainDocument.type = 'complain';

    complainDocument.complainReason = Number(complainReason);

    complainDocument.suggestionSection = null;
  } else if (type === 'suggestion') {
    complainDocument.type = 'suggestion';

    complainDocument.suggestionSection = Number(suggestionSection);

    complainDocument.complainReason = null;
  } else {
    complainDocument.suggestionSection = null;

    complainDocument.complainReason = null;
  }

  complainDocument.details = details;

  complainDocument.TagerID = TagerID;

  await complainRepositoryInstance.create(complainDocument);

  return { status: complainsStatus.COMPLAIN_CREATED };
};


