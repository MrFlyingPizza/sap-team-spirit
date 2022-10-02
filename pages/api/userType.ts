import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, types } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()