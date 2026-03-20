import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import User from "./models.ts/user.model";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials : {
            email : { label : "email" , type : "email" },
            password : { label : "password" , type : "password"}
        },
        async authorize(credentials,request){
            await connectDB();
            const email = credentials.email;
            const password = credentials.password as string;

            const user = await User.findOne({email})
            if(!user){
                throw new Error("User does not exists")
            }

            const isPasswordMatch = await bcrypt.compare(password,user.password);

            if(!isPasswordMatch){
                throw new Error("Invalid password")
            }

            return{
                id : user._id.toString(),
                name : user.name,
                email : user.email,
                role : user.role
            }
        }
    }),
    GitHub({
      clientId:process.env.GITHUB_ID,
      clientSecret:process.env.GITHUB_SECRET
    })
  ],

  callbacks : {

    async signIn({user,account}){
      if(account?.provider=='github'){
        await connectDB()
        let dbUser = await User.findOne({email : user.email})

        if(!dbUser){
          dbUser = await User.create({
            name : user.name,
            email : user.email,
            image : user.image
          })
        }
        user.id = dbUser._id.toString()
        user.role = dbUser.role
      }
      return true
    },

    jwt({token,user,trigger,session}){
        if(user){
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
            token.role = user.role;
        }
        if(trigger =="update"){
          token.role = session.role
          // token.email = session.email
        }
        return token
    },

    session({session,token}){
        if(session.user){
            session.user.id = token.id as string;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
            session.user.role = token.role as string;
        }
        return session
    }
  },

  pages:{
    signIn : '/login',
    error : '/login'
  },

  session : {
    strategy : "jwt",
    maxAge : 10*24*60*60*1000,
  },

  secret : process.env.AUTH_SECRET
})