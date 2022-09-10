import { z } from "zod";

export const routingFromSchema = z.object({ from: z.string() });
export type RoutingFrom = z.infer<typeof routingFromSchema>;
