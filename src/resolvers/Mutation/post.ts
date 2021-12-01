import { Post, Prisma } from ".prisma/client";
import { Context } from "../..";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostCreateArgs {
  title: string;
  content: string;
}
interface PostUpdateArgs {
  postId: string;
  title?: string;
  content?: string;
}

interface PostPayloadType {
  userErrors: { message: string }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    _: any,
    { title, content }: PostCreateArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {

    if (!userInfo) {
      return {
        userErrors: [{ message: "you must be logged in to continue" }],
        post: null
      };
    }

    if (!title || !content) {
      return {
        userErrors: [{ message: "title and content are required" }],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: userInfo.userId,
        },
      }),
    };
  },
  postUpdate: async (
    _: any,
    { postId, title, content }: PostUpdateArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {

    if (!userInfo) {
      return {
        userErrors: [{ message: "you must be logged in to continue" }],
        post: null
      };
    }
    
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma
    });

    if (error) return error;

    if (!title && !content) {
      return {
        userErrors: [{ message: "need a field to update" }],
        post: null,
      };
    }
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!existingPost) {
      return {
        userErrors: [{ message: "post does not exist" }],
        post: null,
      };
    }

    const payloadToUpdate = {
      title: title ? title : existingPost.title,
      content: content ? content : existingPost.content,
    };

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: payloadToUpdate,
      }),
    };
  },
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!existingPost) {
      return {
        userErrors: [{ message: "post does not exist" }],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.delete({
        where: {
          id: Number(postId),
        },
      }),
    };
  },
};
