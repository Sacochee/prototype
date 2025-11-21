import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            // Envoie les identifiants au serveur pour vérifier l'authentification
            const res = await fetch("https://api.flashquizz.fr/user/login", {
              method: "POST",
              headers: { "Content-Type": "application/json", key: "flashquizz" },
              body: JSON.stringify({
                name: credentials!.username,
                password: credentials!.password,
              }),
            });
  
            const user = await res.json();
  
            if (user.status == "Error")
              throw new Error(user.message || "Login failed");
  
            // Stocke le token et l'expiration
            return {
              id: "",
              name: undefined,
              email: undefined,
              token: user.token,
              expire: Date.now() + 3600 * 1000, // Convertit en timestamp
            };
          } catch (error) {
            throw new Error("Invalid credentials");
          }
        },
      }),
    ],
    pages : {
      signIn : '/login',
      error : '/login'
    },
    callbacks: {
      async jwt({ token, user }) {
        
        if (user) {
          token.token = user!.token;
          token.expire = user!.expire;
        }
  
        // Vérifie si le token a expiré
  
        return token;
      },
      async session({ session, token }) {
        session.user!.token = token.token;
        session.user!.expire = token.expire;
        return session;
      },
    },
  };