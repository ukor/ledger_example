import { z } from "zod";
import { ResponseMessage } from "./response_message.dto";

export const HttpResponseDto = z.object({
  isError: z.boolean().default(false),

  // PROPOSAL - With this structure the client can be sure what type of message and banner to display to the user
  message: ResponseMessage.nullable().default(null),

  context: z
    .string()
    .nullish()
    .describe("OK for 2xx range status. ErrorName for other status code. "),

  payload: z.any().nullable(),
});

export type HttpResponseDto = z.infer<typeof HttpResponseDto>;

export const HttpErrorResponseDto = HttpResponseDto.extend({
  isError: z.boolean().default(true),
  payload: z.any().nullable().default(null),
});

export type HttpErrorResponseDto = z.infer<typeof HttpErrorResponseDto>;
