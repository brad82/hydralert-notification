import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import OpenAI from "openai";

const openai = new OpenAI();
const snsClient = new SNSClient({});

function getLocalTime() {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat([], {
    timeZone: "America/Edmonton",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date);
}

async function getNotificationMessage(name) {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "user",
        content:
          `write me a message for ${name} to tell them to drink some water tailored to the current time of ` +
          getLocalTime(),
      },
    ],
  });

  return output_text;
}

export const handler = async ({ PhoneNumber, Name }) => {
  const message = await getNotificationMessage(Name);
  const commandBody = {
    Message: message,
    PhoneNumber,
  };

  const snsResponse = await snsClient.send(new PublishCommand(commandBody));

  const response = {
    statusCode: 200,
    body: JSON.stringify(snsResponse),
  };
  return response;
};
