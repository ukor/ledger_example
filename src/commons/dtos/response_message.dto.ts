import { z } from "zod";

export const ResponseMessageType = z.enum(["error", "warning", "info"]);

export type ResponseMessageType = z.infer<typeof ResponseMessageType>;

export const ResponseMessage = z.object({
  type: ResponseMessageType,
  text: z.string(),
  name: z
    .string()
    .describe("OK for 2xx range status. ErrorName for other status code. "),
  details: z
    .string()
    .describe(
      "An error message for the developers only. This should be null in production. ",
    ),
});

export type ResponseMessage = z.infer<typeof ResponseMessage>;
