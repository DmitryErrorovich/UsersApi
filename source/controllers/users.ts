import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Users from '../models/users';
import https from 'https'

const createUsers = async() => {
  let output;
  const req = await https.get("https://randomuser.me/api/?results=4800", (res) => {
    console.log(` ${res.statusCode}`);
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      // console.log(chunk)
      output += chunk;
    });

    res.on('end', () => {
      // console.log({output})
      let obj = JSON.parse(output.replace("undefined", ""));
      // console.log({obj})
      // for(let i = 0; i <= obj.results.length -1; i ++) {
        Users.insertMany(obj.results)

      // us.save()
      // }

          // .then((result) => {
          //     return {
          //         users: result
          //     };
          // })
          // .catch((error) => {
          //     return {
          //         message: error.message,
          //         error
          //     };
          // });

    });
  })
  req.on('error', (err) => {
    // res.send('error: ' + err.message);
  });

  await req.end();
};

const getAllUsers = async(req: Request, res: Response, next: NextFunction) => {
  console.log(req)
  const {query: {results, page}}: any = req
  // await createUsers(+query)
  try {
    const users = await Users.find().limit(+results * 1).skip((page - 1) * results).exec()
    const count = await Users.countDocuments();
        // .then((users) => {
            return res.status(200).json({
                users: users,
                count: users.length,
                totalPages: Math.ceil(count / results),
                currentPage: page
            });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error
  });
  }
};

export default { getAllUsers };