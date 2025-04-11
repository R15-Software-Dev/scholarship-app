import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, ScanCommand, AttributeValue } from "@aws-sdk/client-dynamodb";

const dbclient = new DynamoDBClient({ region: "us-east-1" });

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {

    // All required sections have at least one required field.
    // If we pick on these few fields, we can run a short query but get the same information.
    // Required fields:
    //   studentFirstName
    //   studentsMajor
    //   guardianOneName

    const command = new ScanCommand({
      TableName: "student-applications",
      FilterExpression: "attribute_exists(studentFirstName)" +
        "AND attribute_exists(studentsMajor)" +
        "AND attribute_exists(guardianOneName)"
    })

    let response = await dbclient.send(command);

    let startKey = response.LastEvaluatedKey;

    // This is an any type right now due to the fact that AWS doesn't like TypeScript too much.
    const items: Record<string, AttributeValue>[] = [];
    if (response.Items) {
      response.Items.forEach((item) => {
        items.push(item);
      });
    }

    // This only runs if the first command didn't get all the information.
    if (startKey) {
      console.log(`Continuing scan with key ${startKey}`);
      while (true) {  // Loop until we get everything.
        response = await dbclient.send(new ScanCommand({
          TableName: "student-applications",
          FilterExpression: "attribute_exists(studentFirstName)" +
            "AND attribute_exists(studentsMajor)" +
            "AND attribute_exists(guardianOneName)",
          ExclusiveStartKey: startKey
        }));

        // If the item value is present, add its contents to the array
        if (response.Items) {
          console.log(`Total items returned: ${response.Count}`);
          response.Items.forEach((item) => {
            items.push(item);
          });
        }

        // If the LastEvaluatedKey is null, we've reached the end of the list.
        if (!response.LastEvaluatedKey) {
          console.log(`Found null key - exiting`);
          break;
        }
        else {
          startKey = response.LastEvaluatedKey;
          console.log(`Continuing with key ${startKey}`);
        }
      }
    }

    // Sort the array of response items.
    items.sort((a, b) => {
      const a_str = a.studentLastName.S.toLowerCase();
      const b_str = b.studentLastName.S.toLowerCase();
      if (a_str < b_str)
        return -1;
      if (a_str > b_str)
        return 1;
      return 0;
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ items }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
