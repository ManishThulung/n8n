import nodemailer from "nodemailer";

interface EmailCredentials {
  user: string;
  pass: string;
}

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

function normalizeAddress(addr: string | { address: string }): string {
  return typeof addr === "string" ? addr : addr.address;
}

export function createEmailClient(config: {
  user: string;
  pass: string;
}): EmailClient {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return {
    async sendMail({
      to,
      subject,
      html,
    }: EmailPayload): Promise<EmailSendResult> {
      const info = await transporter.sendMail({
        from: `n8n <${config.user}>`,
        to,
        subject,
        html,
      });

      return {
        messageId: info.messageId,
        accepted: info.accepted.map(normalizeAddress),
        rejected: info.rejected.map(normalizeAddress),
      };
    },
  };
}

export type { EmailClient, EmailPayload, EmailCredentials, EmailSendResult };
