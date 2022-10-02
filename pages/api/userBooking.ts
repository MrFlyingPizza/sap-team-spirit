import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, user_preferences } from '@prisma/client'

const prisma = new PrismaClient()

const newBooking = async (input_user_id: string, input_event_id: string) => {
    console.log(input_user_id + input_event_id)
    const result = await prisma.users_join_events.create({
        data: {
            user_id: input_user_id,
            event_id: input_event_id
        },
    })
    return result;
}

const getUserBookings = async () => {
    const result = await prisma.users_join_events.findMany({
        include: {
            users: true,
            events: true
        }
    });
    return result;
}

const getUserBookingsByUser = async (input_user_id: string) => {
    const result = await prisma.users_join_events.findMany({
        where: {
            user_id: input_user_id
        },
        include: {
            users: true,
            events: true
        }
    })
    return result;
}
const getUserBookingsByEvent = async (input_event_id: string) => {
    const result = await prisma.users_join_events.findMany({
        where: {
            user_id: input_event_id
        },
        include: {
            users: true,
            events: true
        }
    })
    return result;
}

const deleteUserBooking = async (input_user_id: string) => {
    const result = await prisma.users_join_events.deleteMany({
        where: {
            user_id: input_user_id
        },
    })

    return result;
}

export default async function userTypeHandler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { user_id, event_id, },
        method
    } = req


    switch (method) {
        case 'GET':
            if (!user_id)
                getUserBookings().then(rest => {
                    res.status(200).json({
                        rest
                    })
                })

            if (user_id) {
                getUserBookingsByUser(user_id as string).then(rest => {
                    res.status(200).json(rest)
                })

            }
            if (event_id) {
                getUserBookingsByEvent(event_id as string).then(rest => {
                    res.status(200).json(rest)
                })
            }
            break;
        case 'POST':
            newBooking(user_id as string, event_id as string).then(rest => {
                res.status(200).json(rest)
            })
            break;
        case 'DELETE':
            deleteUserBooking(user_id as string).then(rest => {
                res.status(200).json(rest)
            })
            break
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}