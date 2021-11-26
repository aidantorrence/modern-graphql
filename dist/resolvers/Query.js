"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
exports.Query = {
    posts: function (_, __, _a) {
        var prisma = _a.prisma;
        return prisma.post.findMany({
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ]
        });
    }
};
