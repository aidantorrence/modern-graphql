import { User, Prisma } from ".prisma/client";
import { Context } from "../..";
import validator from "validator";

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
      const isEmailValid = validator.isEmail(email);
        const isPasswordValid = validator.isLength(password, { min: 6 });

    if (!isEmailValid) {
      return {
        userErrors: [{ message: "Email is invalid" }],
        user: null,
      };
    }
    if (!isPasswordValid) {
      return {
        userErrors: [{ message: "password is invalid" }],
        user: null,
      };
    }
    if (!name) {
      return {
        userErrors: [{ message: "name is invalid" }],
        user: null,
      };
    }
    return {
      userErrors: [],
      user: prisma.user.create({
        data: {
          id: 9,
          email,
          password,
          name,
        },
      }),
    };
  },
};
