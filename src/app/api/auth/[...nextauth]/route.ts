import { authOptions } from "@/lib/NextAuth";
import NextAuth from "next-auth";



// La configuration NextAuth


// Exportation des méthodes HTTP spécifiques

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
