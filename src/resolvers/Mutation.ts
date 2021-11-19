import { Post, Prisma } from ".prisma/client";
import { Context } from "..";

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

export const Mutation = {
  postCreate: async (
    _: any,
    { title, content }: PostCreateArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
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
          authorId: 1,
        },
      }),
    };
  },
  postUpdate: async (
    _: any,
    { postId, title, content }: PostUpdateArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
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
};
