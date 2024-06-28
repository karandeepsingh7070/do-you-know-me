import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(2, "user name must contain atleast 2 characters")
    .max(20, "user name should not be more than 20 characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'password must be 6 characters' })
})