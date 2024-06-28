import dbConnect from "@/lib/dbConnect";
import UserModels from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingVerifiedUser = await UserModels.findOne({
            username,
            isVerified: true
        })
        if (existingVerifiedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "user already exists"
                },
                {
                    status: 400
                })
        }
        const existingUserByEmail = await UserModels.findOne({ email })

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json(
                  {
                    success: false,
                    message: 'User already exists with this email',
                  },
                  { status: 400 }
                );
              } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)
                existingUserByEmail.verifyCodeExpiry = expiryDate;
                await existingUserByEmail.save();
              }
        } else {
            let hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModels({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            await newUser.save();
        }
        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }
        return NextResponse.json(
            {
              success: true,
              message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
          );
    }
    catch (error) {
        console.log("Error sending verification code")
        return NextResponse.json({
            success: false,
            message: "Error Registering user"
        },
            {
                status: 500
            }
        )
    }
}
