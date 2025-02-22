import {DynamoDBClient, GetItemCommand} from '@aws-sdk/client-dynamodb';
import { AWSRequest, AWSResponse } from '../types/types';

const client = new DynamoDBClient({region: "us-east-1"});

export async function handler(event: AWSRequest): Promise<AWSResponse> {
  const input = JSON.parse(event.body);

  const command = new GetItemCommand ({
    TableName: "",
    Key: {
      //Key
    },
    AttributesToGet: [
      "studentFirstName",
      "studentLastName",
      "studentIDNumber",
      "studentBirthDate",
      "studentGender",
      "streetAddress",
      "studentTown",
      "studentPhoneNumber",
      "studentEmail",
      "unweightedGPA",
      "readingScoreSAT",
      "mathScoreSAT",
      "highScoreACT",
      "attendBAS"
    ]
  });

  // Send the command
  const dbresponse = await client.send(command);

  // Check that there is an item in the response.
  if (!dbresponse.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({message: "Personal info not found"})
    };
  }

  // Return the item's information
  return {
    statusCode: 200,
    body: JSON.stringify(dbresponse.Item)
  };
}