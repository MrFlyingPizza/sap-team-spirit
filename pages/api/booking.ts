import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, events } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';
import { resourceLimits } from 'worker_threads';


const prisma = new PrismaClient()

const getEventsByUserId = async (input_user_id: string) => 
{
  const result = await prisma.users_join_events.findMany({
    where: {
      user_id : input_user_id
    },
    include : {
      users : true,
      events : true
    }}
  )

  return result;
}
const newBookingFunc = async (inputEventName: string, inputCreatorID:string, inputEventStartTime: string, inputCreationDate: string, input_event_duration: string, input_type_id: string) => {
  const newEvent = await prisma.events.create({
    data: {
      event_id: uuidv4(),
      event_name: inputEventName,
      creater_id : inputCreatorID,
      event_start_time: new Date(inputEventStartTime),
      event_creation_date: new Date(),
      event_duration: parseInt(input_event_duration),
      type_id: input_type_id
    },
  })
  return newEvent;
}

const getBookingFunc = async () => {
  const result = await prisma.events.findMany({
    include: {
      types: true,
      users : true
    }
  });
  return result;
}

const getBookingByIdFunc = async (input_id: string) => {
  const result = await prisma.events.findUnique(
    {
      where: {
        event_id: input_id
      },
      include: {
        types: true,
        users : true
      }
    });

  return result;
}

const deleteBookingByIdFunc = async (input_id: string) => {
  const result = await prisma.events.delete({
    where: {
      event_id: input_id
    },
    include: {
      types: true,
      users : true
    }
  })
  return result;
}

export default async function bookingHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, name, event_name, event_start_time, creatorId,
      event_type_id, event_duration, event_creation_date, userjoineventid },
    method,
  } = req

  switch (method) {
    case 'GET':
      if (!id)
        getBookingFunc().then(rest => {
          res.status(200).json({
            rest
          })
        })

      if (id) {
        getBookingByIdFunc(id as string).then(rest => {
          res.status(200).json(rest)
        })

      }

      if (userjoineventid){
        getEventsByUserId(id as string).then(rest => {
          res.status(200).json(rest)
        })
      }
      break;
    case 'PUT':
      // Update or create data in your database
      res.status(200).json({ id, name: name || `User ${id}` })
      break
    case 'POST':
      newBookingFunc(creatorId as string, event_name as string, event_start_time as string, event_creation_date as string,
        event_duration as string, event_type_id as string).then(rest => {
          res.status(200).json(rest)
        })
      break;
    case 'DELETE':
      deleteBookingByIdFunc(id as string).then(rest => {
        res.status(200).json(rest)
      })
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}