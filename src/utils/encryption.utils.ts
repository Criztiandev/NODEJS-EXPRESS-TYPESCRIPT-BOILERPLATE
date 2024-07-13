import bcrypt from "bcrypt";
import crypto from "crypto";

class EncryptionUtils {
  private static readonly saltRounds = 10;
  private static readonly algorithm = "aes-256-cbc";
  private static readonly key = Buffer.from(
    process.env.ENCRYPTION_KEY_32 || "",
    "hex"
  );
  private static readonly iv = Buffer.from(
    process.env.ENCRYPTION_KEY_16 || "",
    "hex"
  );

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
  }

  static decrypt(encryptedText: string): string {
    const encryptedBuffer = Buffer.from(encryptedText, "hex");
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

export default EncryptionUtils;
