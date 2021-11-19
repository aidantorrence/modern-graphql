import { User, Prisma } from ".prisma/client";
import { Context } from "../..";

interface userCreateArgs {
  email: string;
  password: string;
  name: string;
  bio: string;
}

interface UserPayloadType {
  userErrors: { message: string }[];
  user: User | Prisma.Prisma__UserClient<User> | null;
}

export const authResolvers = {
  userCreate: async (
    _: any,
    { email, password, name }: userCreateArgs,
    { prisma }: Context
  ): Promise<UserPayloadType> => {
    if (!name || !password || !email) {
      return {
        userErrors: [{ message: "name, password, and email are required" }],
        user: null,
      };
    }
    return {
      userErrors: [],
      user: prisma.user.create({
        data: {
          id: 7,
          email,
          password,
          name,
        },
      }),
    };
  },
};
