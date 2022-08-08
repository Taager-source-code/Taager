const paymentRequestErros = Object.freeze({
  MISSING_PHONE_NUMBER: { code: 1, msg: 'Please fill in phone number.' },
  PHONE_NUMBER_IS_GREATER_THAN_11: {
    code: 2,
    msg: 'Phone number is greater than 11 numbers - It must contain 11 numbers.',
  },
  PHONE_NUMBER_IS_LESSER_THAN_11: {
    code: 3,
    msg: 'Phone number is lesser than 11 numbers - It must contain 11 numbers.',
  },
  PHONE_NUMBER_MUST_START_WITH_01: {
    code: 4,
    msg: 'Phone number must start with 01.',
  },
  PHONE_NUMBER_MUST_NOT_HAVE_SPACES: {
    code: 5,
    msg: 'Phone number must not have spaces.',
  },
  PHONE_NUMBER_IS_WRONG: {
    code: 6,
    msg: 'Phone number is wrong and must not have arabic digits.',
  },
  AMOUNT_IS_MISSING: {
    code: 7,
    msg: 'Please fill in the Amount and must be greater than 0.',
  },
  AMOUNT_MUST_BE_GREATER_THAN_0: {
    code: 8,
    msg: 'The Amount must be greeter than 0.',
  },
  PAYMENT_WAY_IS_MISSING: {
    code: 9,
    msg: 'You must choose Payment Way. [vodafone_cash, orange_cash, etisalat_cash, we_pay, bank_transfer].',
  },
  BANK_ACCOUNT_NUMBER_MUST_NOT_HAVE_SPACES: {
    code: 10,
    msg: 'Bank account number must not have spaces.',
  },
  BANK_ACCOUNT_NUMBER_MUST_NOT_HAVE_ARABIC_DIGITS: {
    code: 11,
    msg: 'Bank account number must not have arabic digits.',
  },
});

const paymentRequestConstants = Object.freeze({
  BANK_TRANSFER: 'bank_transfer',
});

const validateAmount = amount => {
  if (!amount) {
    return paymentRequestErros.AMOUNT_IS_MISSING;
  }
  if (amount < 0) {
    return paymentRequestErros.AMOUNT_MUST_BE_GREATER_THAN_0;
  }
  return null;
};

const validatePhoneNum = phoneNum => {
  if (!phoneNum || phoneNum === '') {
    return paymentRequestErros.MISSING_PHONE_NUMBER;
  }
  if (phoneNum.length > 11) {
    return paymentRequestErros.PHONE_NUMBER_IS_GREATER_THAN_11;
  }
  if (phoneNum.length < 11) {
    return paymentRequestErros.PHONE_NUMBER_IS_LESSER_THAN_11;
  }
  if (!phoneNum.startsWith('01')) {
    return paymentRequestErros.PHONE_NUMBER_MUST_START_WITH_01;
  }
  if (/\s/.test(phoneNum)) {
    return paymentRequestErros.PHONE_NUMBER_MUST_NOT_HAVE_SPACES;
  }
  if (!/^(01)[0-9]{9}$/.test(phoneNum)) {
    return paymentRequestErros.PHONE_NUMBER_IS_WRONG;
  }
  return null;
};

const validatePaymentWayNumber = (paymentWay, number) => {
  if (!paymentWay) {
    return paymentRequestErros.PAYMENT_WAY_IS_MISSING;
  }
  if (paymentWay === paymentRequestConstants.BANK_TRANSFER) {
    return null;
  }
  return validatePhoneNum(number);
};

const validatePaymentRequest = (number, amount, paymentWay) => {
  if (validateAmount(amount)) {
    return validateAmount(amount);
  }
  if (validatePaymentWayNumber(paymentWay, number)) {
    return validatePaymentWayNumber(paymentWay, number);
  }
  return null;
};

export = { validatePaymentRequest };


