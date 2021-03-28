import { NextFunction, Request, Response } from "express";
import Users from "../models/users";

const putUsers = async (req: Request, res: Response, next: NextFunction) => {
  await Users.findOneAndUpdate({ _id: req.body.user._id }, req.body.user, {
    new: true,
    returnOriginal: false,
  }).exec((err, user) => {
    if (err) return res.status(500).json({ err: err.message });
    res.json({ user, message: "Successfully updated" });
  });
};

// TODO: REMOVE WHEN NO NEED TO PARSE
// const createUsers = async() => {
//   let output;
//   const req = await https.get("https://randomuser.me/api/?results=4800", (res) => {
//     console.log(` ${res.statusCode}`);
//     res.setEncoding('utf8');

//     res.on('data', (chunk) => {
//       // console.log(chunk)
//       output += chunk;
//     });

//     res.on('end', () => {
//       // console.log({output})
//       let obj = JSON.parse(output.replace("undefined", ""));
//       // console.log({obj})
//       // for(let i = 0; i <= obj.results.length -1; i ++) {
//         Users.insertMany(obj.results)

//       // us.save()
//       // }

//           // .then((result) => {
//           //     return {
//           //         users: result
//           //     };
//           // })
//           // .catch((error) => {
//           //     return {
//           //         message: error.message,
//           //         error
//           //     };
//           // });

//     });
//   })
//   req.on('error', (err) => {
//     // res.send('error: ' + err.message);
//   });

//   await req.end();
// };

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const {
    query: { results = 10, page = 1, searchValue = "" },
  }: any = req;
  console.log({searchValue})
  try {
    
    const users = await Users.find({"name.first": {$regex: RegExp(searchValue, "i")}})
      .limit(+results * 1)
      .skip((page - 1) * results)
      .exec();
    const count = await Users.find({"name.first": {$regex: RegExp(searchValue, "i")}}).countDocuments();
    return res.status(200).json({
      users: users,
      count: users.length,
      totalPages: Math.ceil(count / results),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  await Users.find({ _id: req.query.id }).exec((err, user) => {
    if (err) return res.status(500).json({ err: err.message });
    res.json({ user: user ? user[0] : [], message: "Successfully updated" });
  });
};

export default { getAllUsers, putUsers, getUser };
