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
    input: `write a message to ${name} telling them to drink some water. Base it on the current time of day`,
    instructions: `The current time is ${getLocalTime()}. Make it sound like a friendly reminder.`,
  });

  console.log("OpenAI response:", response);

  return response.output_text;
}

export const handler = async ({ PhoneNumber, Name }) => {
  const message = await getNotificationMessage(Name);
  const commandBody = {
    Message: message,
    PhoneNumber,
  };

  console.log("Sending message:", commandBody);
  const response = await snsClient.send(new PublishCommand(commandBody));

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
