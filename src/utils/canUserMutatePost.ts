import { Context } from '..'

interface CanUserMutatePostParams {
    userId: number,
    postId: number,
    prisma: Context['prisma']
}

export const canUserMutatePost = async (  
    {
        postId,
        userId,
        prisma,
    }: CanUserMutatePostParams ) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return {
          userErrors: [{ message: "user not found" }],
          post: null,
        };
      }
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!post) {
        return {
            userErrors: [{ message: "post not found by user" }],
            post: null
          };
    }
    if (post?.authorId !== user.id) {
        return {
            userErrors: [{ message: "you can't edit this post" }],
            post: null
        };
    }
};

