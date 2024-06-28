import { ApiResponse } from './../types/ApiResponse';
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/EmailVerification";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode: string
): Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Do you Know Me, Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {success: true, message: "successfully sent verification email"}
    }
    catch(error) {
        console.log("Error sending verification email")
        return {success: false, message: "Failed to send verification email"}
    }
}
