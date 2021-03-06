import { gql } from 'apollo-server';

export const typeDefs = gql`
    type Query {
        posts: [Post!]!
    }

    type Mutation {
        postCreate(title: String, content: String): PostPayload!
        postUpdate(postId: ID!, title: String, content: String): PostPayload!
        postDelete(postId: ID!): PostPayload!
        userCreate(name: String!, email: String!, password: String!, bio: String!): AuthPayload!
        userLogin(email: String!, password: String!): AuthPayload!
        userDelete(id: ID!): UserDeletePayload!
    }
    type Post {
        id: ID!
        title: String!
        content: String!
        published: Boolean!
        createdAt: String!
        user: User!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        createdAt: String!
        profile: Profile!
        posts: [Post!]!
    }
    type Profile {
        id: ID!
        bio: String!
        user: User!
    }
    type UserError {
        message: String!
    }
    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }
    type PostInput {
        title: String
        content: String
    }
    type AuthPayload {
        userErrors: [UserError!]!
        token: String
    }
    type UserDeletePayload {
        userErrors: [UserError!]!
        user: User
    }
`;