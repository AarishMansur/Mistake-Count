import { prisma } from "@repo/db";
import { Request, Response } from "express";


export const votePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!postId) {
            return res.status(400).json({ message: "postId is required" });
        }

        const postExists = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        }

        const existingVote = await prisma.vote.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId
                }
            }
        })

        if (existingVote) {
            await prisma.vote.delete({
                where: {
                    id: existingVote.id
                }
            })
            return res.json({ message: "Vote removed" });
        }
           
        const vote = await prisma.vote.create({
            data: {
                postId,
                userId
            }
        })
        return res.json(vote);
    } catch (error) {
        console.error("Vote error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}