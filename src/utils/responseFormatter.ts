import { Response } from 'express';

// Define the standard response structure
interface ResponseFormat {
  status: number;
  message: string;
  data?: any;  // Optional data field
  error?: string; // Optional error field
}

// Response utility function
export const sendResponse = (res: Response, { status, message, data, error }: ResponseFormat) => {
  res.status(status).json({
    status,
    message,
    ...(data && { data }), // Include data if available
    ...(error && { error }), // Include error if available
  });
};
