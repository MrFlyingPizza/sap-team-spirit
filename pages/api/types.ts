import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, types } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()

const newTypeFunc = async (typeName: string) => {
    const newUser = await prisma.types.create({
        data: {
            type_name: typeName,
            type_id: uuidv4(),
        },
    })
    return newUser;
}

const getTypes = async () => {
    const result = await prisma.types.findMany();
    return result;
}
const getTypeById = async (input_id: string) => {
    const result = await prisma.types.findUnique({
        where: {
            type_id: input_id
        },
    })
    return result;
}

const deleteTypeById = async (input_id: string) => {
    const result = await prisma.types.delete({
        where: {
            type_id: input_id
        }
    })
}

export default async function bookingHandler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id, name, utcTime },
        method,
    } = req

    switch (method) {
        case 'GET':
            // Get data from your database
            if (!id) {

                const result = getTypes().then(rest => {
                    res.status(200).json(rest)
                })
            }
            if (id) {
                getTypeById(id as string).then(rest => {
                    res.status(200).json(rest)
                })
                
            }

            break
        case 'PUT':
            // Update or create data in your database
            res.status(200).json({ id, name: name || `User ${id}` })
            break
        case 'POST':
            const result = newTypeFunc(name as string).then(rest => {
                res.status(200).json({ "result" : "success" })
            })
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}