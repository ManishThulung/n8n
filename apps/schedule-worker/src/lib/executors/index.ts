import axios from "axios";
import { emailClient } from "../email";

export async function executeHttpNode(node: any) {
  const { method, url } = node.data.metadata.data;
  const res = await axios({ method, url });
  return res.data;
}

export async function executeEmailNode(node: any, httpResults: any[]) {
  const { subject, to } = node.data.metadata.data;

  const completedOnly = httpResults.filter((r) => r && r.completed === true);

  await emailClient.sendMail({
    to,
    subject,
    html: `
      <h3>Workflow Execution Result</h3>
      <pre>${JSON.stringify(completedOnly, null, 2)}</pre>
    `,
  });
}
