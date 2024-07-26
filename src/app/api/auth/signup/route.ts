import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  if(request.method === "POST") {
    try {
      const { email, password, firstName, lastName } = await request.json();
      const hashedPassword = await bcrypt.hash(password, 10)

      const existingUser = await db.user.findMany({
        where: {
          email:email
        }
      })
   
      if (existingUser.length > 0) {
        return new Response(JSON.stringify({
          status: 400,
          headers: {
            "Content-Type": "application/json"
          },
          message: "User already exists"
        }));
      }
      
      const newUser = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName
        }
      })
      return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      })
    } catch(error) {
      return new Response(JSON.stringify({error: error}))
    }
  } 
}
