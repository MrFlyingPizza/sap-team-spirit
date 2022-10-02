import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, users } from '@prisma/client'


const prisma = new PrismaClient()


const newUserFunc = async (typeName : string, user_id: string) => {
    const newUser = await prisma.users.create({
      data: {
        user_name : typeName,
        user_id: user_id,
      },
    })
    return newUser
  }

const getUserById = async (input_id: string) => {
    
    const result = await prisma.users.findUnique({
        where: {
            user_id : input_id
        },
        include : {
            user_preferences : true,
        }
        
    })


    console.log(result?.user_name)
    return result
}

const deleteUserById = async (input_id: string) => {
    const result = await prisma.users.delete({
        where: {
            user_id : input_id
        }
    })
    return result;
}


export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id, name, utcTime },
        method,
      } = req

  switch (method) {
    case 'GET':
      // Get data from your database
    if(!id)
      res.status(200).json( await prisma.users.findMany())

    if(id){
        let result = getUserById(id as string).then(users => {
            res.status(200).json(users);
        }).catch(console.error);
    }

      break
    case 'POST':
      // Update or create data in your database
      let result = newUserFunc(name as string, id as string).then(rest => {
        res.status(200).json({
            "status" : "inserted"
        })
      })
      res.status(200).json({ id, name: name || `User ${id}` })
      break;
    case 'DELETE':
        if(id){
            let result = deleteUserById(id as string).then(rest => {
                res.status(200).json({"status" : "delete"});
            })
        }
        break;
    
    case 'POST':
        res.status(200).json({req})
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}