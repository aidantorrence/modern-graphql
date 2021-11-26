import { User, Prisma } from ".prisma/client";
import { Context } from "../..";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { KEYS } from "../../keys";

interface userCreateArgs {
  email: string;
  password: string;
  name: string;
  bio: string;
}

interface UserPayloadType {
  userErrors: { message: string }[];
  token: string | null;
}

interface UserDeletePayloadType {
  userErrors: { message: string }[];
  user: User | Prisma.Prisma__UserClient<User> | null;
}

export const authResolvers = {
  userCreate: async (
    _: any,
    { email, password, name, bio }: userCreateArgs,
    { prisma }: Context
  ): Promise<UserPayloadType> => {
    const isEmailValid = validator.isEmail(email);
    const isPasswordValid = validator.isLength(password, { min: 6 });

    if (!isEmailValid) {
      return {
        userErrors: [{ message: "Email is invalid" }],
        token: null,
      };
    }
    if (!isPasswordValid) {
      return {
        userErrors: [{ message: "password is invalid" }],
        token: null,
      };
    }
    if (!name || !bio) {
      return {
        userErrors: [{ message: "name or bio is invalid" }],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    const token = JWT.sign({ userId: user.id }, KEYS.JWT_SIGNATURE);
    return {
      userErrors: [],
      token,
    };
  },
  userLogin: async (
    _: any,
    { email, password }: { email: string; password: string },
    { prisma }: Context
  ): Promise<UserPayloadType> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        userErrors: [{ message: "User not found" }],
        token: null,
      };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        userErrors: [{ message: "Password is invalid" }],
        token: null,
      };
    }
    return {
      userErrors: [],
      token: JWT.sign({ userId: user.id }, KEYS.JWT_SIGNATURE),
    };
  },
  userDelete: async (
    _: any,
    { id }: { id: string },
    { prisma }: Context
  ): Promise<UserDeletePayloadType> => {
    return {
      userErrors: [],
      user: prisma.user.delete({
        where: {
          id: Number(id),
        },
      }),
    };
  },
};
