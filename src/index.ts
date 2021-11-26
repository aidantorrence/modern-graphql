import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { Query, Mutation } from './resolvers';
import { PrismaClient } from '@prisma/client'
import { getUserFromToken } from './utils/getUserFromToken';

const prisma = new PrismaClient()

export interface Context {
    prisma: PrismaClient
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation
    },
    context: ({req}) => {
        console.log(req.headers.authorization)
        const token = req.headers.authorization || ''
        // getUserFromToken
        return { prisma }
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
}
);
