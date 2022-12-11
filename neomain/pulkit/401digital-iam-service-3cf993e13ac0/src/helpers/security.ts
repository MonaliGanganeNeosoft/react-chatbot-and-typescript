import { generate } from 'generate-password';
import { compareSync, hashSync } from 'bcrypt';

export class SecurityHelper {
  static getPassword() {
    return generate({
      length: 20,
      lowercase: true,
      uppercase: true,
    });
  }

  static getHash(text: string) {
    return hashSync(text, 10);
  }

  static compare(text: string, hash: string) {
    return compareSync(text, hash);
  }
}
