import { Post, Prisma } from ".prisma/client";
import { Context } from "../..";

interface userCreate {
    email: string;
    password: string;
    name: string;
}

export const authResolvers = {

  };