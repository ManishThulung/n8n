import { MAIL_PASS, MAIL_USER } from "@/config";
import { createEmailClient } from "@n8n/email";

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
}

interface EmailSendResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
}

interface EmailClient {
  sendMail(payload: EmailPayload): Promise<EmailSendResult>;
}
export const emailClient: EmailClient = createEmailClient({
  user: MAIL_USER,
  pass: MAIL_PASS,
});
