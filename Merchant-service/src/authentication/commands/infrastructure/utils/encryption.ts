import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/* const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
 */

export const hashPassword = password => bcrypt.hash(password, 10);

export const comparePasswordToHash = (candidatePassword, hash) => {
  if (!candidatePassword || !hash) {
    return false;
  }

  return bcrypt.compare(candidatePassword, hash);
};

export const genToken = (length, encoding) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err) {
        return reject(err);
      }
      resolve(buf.toString(encoding));
    });
  });

/*  export function encrypt(text) => {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  }

  export function decrypt (pass_iv, text) => {
   let iv = Buffer.from(pass_iv, 'hex');
   let encryptedText = Buffer.from(text, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
   decipher.setAutoPadding(false);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
  } */


