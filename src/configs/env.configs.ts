import { z } from "zod";

const configEnvSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
    NEXT_PUBLIC_URL: z.string()
})

const configEnvInstance = configEnvSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
});

if (!configEnvInstance.success) {
    console.error(configEnvInstance.error.errors);
    throw new Error("::: 🔴 Invalid environment variables :::");
}

const configEnv = configEnvInstance.data;
export default configEnv;
