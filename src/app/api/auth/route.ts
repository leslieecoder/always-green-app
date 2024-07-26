import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { handleLogin } from "@/services/sessionService";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, response: NextResponse) {
  if(request.method === "POST") {
    try {
      const { email, password } = await request.json()

      const user = await db.user.findFirst({
        where: {
          email: email
        }
      })
      
      if (!user) {
        return new Response(JSON.stringify({
          status: 400,
          headers: {
            "Content-Type": "application/json"
          },
          message: "User or password incorrect"
        }))
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return new Response(JSON.stringify({
          status: 400,
          headers: {
            "Content-Type": "application/json"
          },
          message: "User or password incorrect"
        }));
      }

      const session = await handleLogin(user)


      if(session) {

        return new Response(JSON.stringify({
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
          message: "Login successful",
  
        }));
      }

    } catch(error) {
      return new Response(JSON.stringify({error: error}))
    }
  }
}