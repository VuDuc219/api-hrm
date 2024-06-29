import Hobby from "../models/Hobby.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { generalRefreshToken, generalAccessToken } from './JwtService.js';

const getAllHobby = async (limit, offset) => {
  try {
    let query = {};

    // Use the `find` method with the query object
    const hobbies = await Hobby.find(query)
      .exec();

    // Apply limit and offset
    const slicedHobbies = hobbies.slice(Number(offset), Number(offset) + Number(limit));

    return slicedHobbies;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getAllHobbyByKeyWord = async (limit, offset, keyWord) => {
  try {
    let query = {};

    // If the keyword is not empty, add it to the query
    if (keyWord) {
      query = { hobbyName: { $regex: keyWord, $options: 'i' } };
    }

    // Use the `find` method with the query object
    const hobbies = await Hobby.find(query)
      .exec();

    // Only sort if the keyword is not empty
    if (keyWord) {
      hobbies.sort((a, b) => {
        const aIndex = a.hobbyName.toLowerCase().indexOf(keyWord.toLowerCase());
        const bIndex = b.hobbyName.toLowerCase().indexOf(keyWord.toLowerCase());
        return aIndex - bIndex;
      });
    }

    // Apply limit and offset
    const slicedHobbies = hobbies.slice(Number(offset), Number(offset) + Number(limit));

    return slicedHobbies;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { username, email, password, create_by } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        reject({
          status: "ERR",
          message: "The email is already existed",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        username,
        email,
        password: hash,
        create_by
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "Created successfully!",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateUserBasicInfo = async (userId, changes) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Update fields if they exist in the 'changed' object
    if (changes.avatar) {
      user.avatar = changes.avatar;
    }
    if (changes.full_name) {
      user.full_name = changes.full_name;
    }
    if (changes.bio) {
      user.bio = changes.bio;
    }
    if (changes.dateOfBirth) {
      user.dateOfBirth = changes.dateOfBirth;
    }
    if (changes.gender) {
      user.gender = changes.gender;
    }

    // Save the updated user
    await user.save();
    return user;
  } catch (error) {
    return `Error updating user information: ${error.message}`;
  }
}
const getAllUser = async () => {
  try {
    const listUser = User.find({ isBan: false }).exec();
    console.log(listUser);
    return listUser;

  }
  catch (err) {
    throw new Error(err.toString())
  }
}
const getUserByID = async (userId) => {
  try {
    const detailUser = await User.findOne({ _id: userId })
    .select('-password')
    .populate('create_by', '_id full_name username email').exec();
    return detailUser;
  } catch (err) {
    throw new Error(err.toString())
  }
}
const updatePassword = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const {email, password } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email
      });
      console.log('checkUser', checkUser);

      if (checkUser === null) {
        reject({
          status: "ERR",
          message: "Please click the right link",
        });
      }

      const hash = bcrypt.hashSync(password, 10);
      const updatedUser = await User.findOneAndUpdate( {email: email},{
        password: hash,
      }).select('-password');
      if (updatedUser) {
        resolve({
          status: "OK",
          message: "Update successfully!",
          data: updatedUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const login = (userInfo) => {
  return new Promise((resolve, reject) => {
    const { email, password } = userInfo;
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              const accessToken = generalAccessToken({
                id: user._id
              });

              const refreshToken = generalRefreshToken({
                id: user._id
              });

              resolve({
                status: "OK",
                message: "SUCCESS",
                accessToken: accessToken,
                refreshToken: refreshToken,
                data: {
                  id: user._id,
                  username: user.username,
                  avatar: user.avatar,
                  email: user.email,
                  isAdmin: user.isAdmin,
                  bio: user.bio,
                  // hobbies: user.hobbies,
                  gender: user.gender,
                  dateOfBirth: user.dateOfBirth,
                  isBan: user.isBan
                }
              });
            } else {
              reject({
                status: "ERR",
                message: "Wrong password",
              });
            }
          });
        } else {
          reject({
            status: "ERR",
            message: "Wrong email",
          });
        }
      })
      .catch((e) => {
        reject(e);
      });
  })
}
const getUserInfoByAccessToken = (accessToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(accessToken, process.env.PRIVATE_KEY, async (err, user) => {
        if (err) {
          reject({
            status: "ERR",
            message: "The authentication"
          })
        }
        const { id } = user;
        const userInfo = await User.findOne({
          _id: id
        })

        if (userInfo) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: {
              _id: userInfo._id,
              username: userInfo.username,
              avatar: userInfo.avatar,
              friends: userInfo.friends,
              isAdmin: userInfo.isAdmin,
              bio: userInfo.bio,
              hobbies: userInfo.hobbies,
              gender: userInfo.gender,
              location: userInfo.location,
              attractedBy: userInfo.attractedBy,
              dateOfBirth: userInfo.dateOfBirth
            }
          })
        }

        reject({
          status: "ERR",
          message: "The authentication"
        })

      })
    } catch (error) {
      reject(error);
    }
  })
}
export default {
  getAllHobby,
  getAllHobbyByKeyWord,
  createUser,
  getAllUser,
  updateUserBasicInfo,
  getUserByID,
  updatePassword,
  login,
  getUserInfoByAccessToken
}
