import { prisma } from '@repo/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { generateAvatar } from '../utils/randomAvatar'
import { randomUsername } from '../utils/randomUsergenerator'



export const register = async (req: Request, res: Response) => {
  try {
    const { password, role, company, username: providedUsername, avatar: providedAvatar } = req.body;
    if (!password || !role || !company) {
      return res.status(400).json({ message: "Password, role, and company are required" });
    }
    const username = providedUsername || randomUsername();
    const avatar = providedAvatar || (providedUsername ? generateAvatar(providedUsername) : generateAvatar(username));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        avatar,
        role,
        company,
        password: hashedPassword,
      }
    })
    const payload = {
      userId: user.id
    }
    const secret = process.env.JWT_SECRET as string;

    const token = jwt.sign(payload, secret, {
      expiresIn: "24h"
    })

    return res.json({ token, id: user.id, username, avatar });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Wrong password" })
    }

    const payload = {
      userId: user.id
    }
    const secret = process.env.JWT_SECRET as string;

    const token = jwt.sign(payload, secret, {
      expiresIn: "24h"
    })
    return res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        avatar: user.avatar,
        role: user.role
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}