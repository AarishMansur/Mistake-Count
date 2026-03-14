import { prisma } from '@repo/db'
import { Request, Response } from 'express'


export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }
    if (tags && !Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags must be an array" });
    }
    
    const tagsToCreate = Array.isArray(tags) ? tags : [];

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.userId as string,
        tags: {
          create: tagsToCreate.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
    })

    return res.json(post);
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export const getPosts = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findMany({
      include: {
        author: true,
        tags: {
          include: {
            tag: true
          }
        },
        votes: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    return res.json(post);
  } catch (error) {
    console.error("Get posts error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const searchPost = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";

    const post = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
        ]
      }
    })

    return res.json(post);
  } catch (error) {
    console.error("Search post error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}