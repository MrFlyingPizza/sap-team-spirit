import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, events } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';
import { resourceLimits } from 'worker_threads';


const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB

const newBookingFunc = async (inputEventName: string, inputEventStartTime: string, inputCreationDate: string, input_event_duration: string, input_type_id: string) => {
  const newUser = await prisma.events.create({
    data: {
      event_id: uuidv4(),
      event_name: inputEventName,
      event_start_time: new Date(inputEventStartTime),
      event_creation_date: new Date(),
      event_duration: parseInt(input_event_duration),
      type_id: input_type_id
    },
  })
  return newUser
}

const getBookingFunc = async () => {
  const result = await prisma.events.findMany();
  return result;
}

const getBookingByIdFunc = async (input_id : string) => {
  const result = await prisma.events.findUnique({where: {
    event_id: input_id
  }});

  return result;
}

const deleteBookingByIdFunc = async (input_id : string) => {
  const result = await prisma.events.delete({ where : {
    event_id : input_id
  }})
  return result;
}

export default async function bookingHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, name, event_name, event_start_time,
       event_type_id, event_duration, event_creation_date },
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
      break;
    case 'PUT':
      // Update or create data in your database
      res.status(200).json({ id, name: name || `User ${id}` })
      break
    case 'POST':
      newBookingFunc(event_name as string, event_start_time as string, event_creation_date as string,
         event_duration as string, event_type_id as string).then( rest => {
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