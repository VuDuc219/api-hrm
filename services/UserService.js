// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { config } = require('dotenv');
// const { generalRefreshToken, generalAccessToken } = require("./JwtService");

import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { generalRefreshToken, generalAccessToken } from './JwtService.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

config();

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { username, email, password } = newUser;
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
    if (changes.bio) {
      user.bio = changes.bio;
    }
    if (changes.dateOfBirth) {
      user.dateOfBirth = changes.dateOfBirth;
    }
    if (changes.gender) {
      user.gender = changes.gender;
    }
    if (changes.hobbies) {
      user.hobbies = changes.hobbies;
    }
    if (changes.hobbies) {
      user.hobbies = changes.hobbies;
    }
    if (changes.location) {
      user.location.type = 'Point'
      user.location.coordinates = [changes.location.lng, changes.location.lat];
    }
    if (changes.attractedBy) {
      user.attractedBy = changes.attractedBy;
    }

    // Save the updated user
    await user.save();
    return user;
  } catch (error) {
    return `Error updating user information: ${error.message}`;
  }
}

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
                  friends: user.friends,
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

const getUserInfoById = async (userId) => {
  try {
    const userInfo = await User.findById({ _id: mongoose.Types.ObjectId.createFromHexString(userId) })
      .populate('hobbies');
    const userPublicData = {
      _id: userInfo._id,
      username: userInfo.username,
      avatar: userInfo.avatar,
      friends: userInfo.friends,
      isAdmin: userInfo.isAdmin,
      bio: userInfo.bio,
      hobbies: userInfo.hobbies,
      gender: userInfo.gender,
      dateOfBirth: userInfo.dateOfBirth,
      location: userInfo.location
    }
    return userPublicData;
  } catch (error) {
    throw new Error(error.toString());
  }
}

const getUserAnalysticNumber = async (userId) => {
  try {
    let numberOfPosts = await Post.countDocuments({ author: userId });
    let numberOfLikes = await Post
      .aggregate([
        {
          $match: { author: mongoose.Types.ObjectId.createFromHexString(userId) }
        },
        {
          $project: {
            likesCount: { $size: '$likes' }
          }
        },
        {
          $group: {
            _id: null,
            totalLikes: { $sum: '$likesCount' }
          }
        }
      ]);

    let analyticNumber = {
      numberOfLikes: numberOfLikes && numberOfLikes.length > 0 ? numberOfLikes[0].totalLikes : 0,
      numberOfPosts: numberOfPosts
    }

    return analyticNumber;
  } catch (error) {
    throw new Error(error.toString())
  }
}

const getMatchedUsers = async (location, hobbies, attractedBy, userId, limit, offset) => {
  try {
    // Convert string hobby IDs to ObjectId
    const hobbiesObjectIds = hobbies;

    // Perform the query to find matching users with limit and offset
    const matchingUsers = await User.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [location.coordinates[0], location.coordinates[1]] },
          distanceField: 'distance',
          spherical: true
        }
      },
      {
        $match: {
          _id: { $ne: userId }, // Exclude the user by their userId
          location: { $exists: true, $ne: null },
          gender: attractedBy
        }
      },
      {
        $addFields: {
          common_hobbies: {
            $size: {
              $setIntersection: ['$hobbies', hobbiesObjectIds]
            }
          }
        }
      },
      {
        $sort: {
          distance: 1,
          common_hobbies: -1
        }
      },
      {
        $skip: Number(offset) // Apply offset
      },
      {
        $limit: Number(limit) // Apply limit
      }
    ]);

    return matchingUsers;
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error for proper error handling
  }
};

const sendMatchRequest = async (targetUserId, userId) => {
  // Check if the target user already has the request from the same user
  const user = await User.findOne({ _id: targetUserId, requestMatch: userId });

  if (!user) {
    // If not, push the request
    await User.updateOne({ _id: targetUserId }, { $addToSet: { requestMatch: userId } });
    console.log(`Match request sent to user ${targetUserId}`);
  } else {
    console.log(`Match request already exists for user ${targetUserId}`);
  }
}

const updatePassword = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const {email, password, uuid } = newUser;
    try {
      const checkUser = await User.findOne({
        uuid: uuid,
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
        uuid: null
      });
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

export {
  createUser,
  login,
  getUserInfoByAccessToken
};

export default {
  createUser,
  login,
  getUserInfoByAccessToken,
  getUserAnalysticNumber,
  updateUserBasicInfo,
  getUserInfoById,
  getMatchedUsers,
  sendMatchRequest,
  updatePassword
};