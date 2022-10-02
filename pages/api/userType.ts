import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, user_preferences } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()

const newUserType = async (input_user_id: string, input_type_id: string) => {
    console.log(input_user_id + input_type_id)
    const result = await prisma.user_preferences.create({
        data: {
            user_id: input_user_id,
            type_id: input_type_id
        },
    })
    return result;
}

const getUserTypes = async () => {
    const result = await prisma.user_preferences.findMany();
    return result;
}

const getUserTypeByUserId = async (input_user_id: string) => {
    const result = await prisma.user_preferences.findMany({
        where: {
            user_id: input_user_id
        },
        include : {
            users : true,
            types : true
        }
    })
    return result;
}

const deleteUserTypeById = async (input_user_id: string) => {
    const result = await prisma.user_preferences.deleteMany({
        where: {
            user_id: input_user_id
        }
    })

    return result;
}

export default async function userTypeHandler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id, user_id, type_id, },
        method
    } = req


    switch (method) {
        case 'GET':
            if (!id)
                getUserTypes().then(rest => {
                    res.status(200).json({
                        rest
                    })
                })

            if (id) {
                getUserTypeByUserId(id as string).then(rest => {
                    res.status(200).json(rest)
                })

            }
            break;
        case 'POST':
            newUserType(user_id as string, type_id as string).then(rest => {
                res.status(200).json(rest)
            })
            break;
        case 'DELETE':
            deleteUserTypeById(id as string).then(rest => {
                res.status(200).json(rest)
            })
            break
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}