import { OAuth2Client } from 'google-auth-library';

import axios, { AxiosRequestConfig } from 'axios';

import { AuthProvider } from '../../domain/models/socialAuth.model';
import Env from '../../../../Env';

const client = new OAuth2Client();

const validateFacebookToken = async token => {
  const tokenVerificationToken: AxiosRequestConfig = {
    method: 'get',
    url: `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${Env.FACEBOOK_APP_ID}|${
      Env.FACEBOOK_APP_SECRET
    }`,
  };

  const verificationResult = await axios(tokenVerificationToken);

  if (!verificationResult.data.data.is_valid) {
    throw new Error('Token not valid');
  }
};

const validateGoogleToken = async (token, email) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: Env.GOOGLE_AUDIENCES,
  });

  const payload = ticket.getPayload();

  if (payload != null && email !== payload.email) {
    throw new Error("Emails don't match");
  }
};

export const validateToken = async (provider, token, email) => {
  if (provider === AuthProvider.FACEBOOK) {
    await validateFacebookToken(token);
  } else {
    await validateGoogleToken(token, email);
  }
};


