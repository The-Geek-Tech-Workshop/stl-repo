import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client(); 
const ddbClient = new DynamoDBClient(); 
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const STL_BUCKET = process.env.STL_BUCKET;
const STL_METADATA_TABLE = process.env.STL_METADATA_TABLE;

export const lambdaHandler = async (event) => {
    const { httpMethod, path, pathParameters, body } = event;

    try {
        if (httpMethod === 'GET' && path === '/files') {
            return await listFiles();
        } else if (httpMethod === 'GET' && path.startsWith('/files/')) {
            const fileId = pathParameters.fileId;
            return await getFile(fileId);
        } else if (httpMethod === 'GET' && path.startsWith('/stl/')) {
            const fileId = pathParameters.fileId;
            return await getStl(fileId);
        }  else if (httpMethod === 'POST' && path === '/files') {
            const fileData = JSON.parse(body);
            return await uploadFile(fileData);
        } else if (httpMethod === 'POST' && path === '/parse') {
            const parseData = JSON.parse(body);
            return await parseSTL(parseData);
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid endpoint' })
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: error.message })
        };
    }
};

async function listFiles() {
    const params = {
        TableName: STL_METADATA_TABLE
    };

    const data = await ddbDocClient.send(new ScanCommand(params));

    return {
        statusCode: 200,
        body: JSON.stringify(data.Items)
    };
}

async function getFile(fileId) {
    const params = {
        TableName: STL_METADATA_TABLE,
        Key: { id: fileId }
    };

    const data = await ddbDocClient.send(new GetCommand(params));

    if (!data.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'File not found' })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data.Item)
    };
}

async function getStl(fileId) {
    const params = {
        TableName: STL_METADATA_TABLE,
        Key: { id: fileId }
    };

    const data = await ddbDocClient.send(new GetCommand(params));

    if (!data.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'File not found' })
        };
    }

    const s3Params = {
        Bucket: STL_BUCKET,
        Key: data.Item.s3_key
    };

    const stlS3Object =  await s3Client.send(new GetObjectCommand(s3Params));
    const fileData = await stlS3Object.Body.transformToString();

    return {
        statusCode: 200,
        body: fileData
    }

}

async function uploadFile(fileData) {
    const { file_content, file_name, description, tags } = fileData;

    const fileId = uuidv4();
    const s3Key = `stl_files/${fileId}.stl`;

    const s3Params = {
        Bucket: STL_BUCKET,
        Key: s3Key,
        Body: Buffer.from(file_content, 'base64')
    };

    await s3Client.send(new PutObjectCommand(s3Params));

    const ddbParams = {
        TableName: STL_METADATA_TABLE,
        Item: {
            id: fileId,
            file_name: file_name,
            description: description,
            tags: tags,
            s3_key: s3Key
        }
    };

    await ddbDocClient.send(new PutCommand(ddbParams));

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'File uploaded successfully',
            file_id: fileId
        })
    };
}

async function parseSTL(parseData) {
    // Implement STL parsing logic here
    // This is a placeholder function
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'STL parsing not implemented yet',
            data: parseData
        })
    };
}