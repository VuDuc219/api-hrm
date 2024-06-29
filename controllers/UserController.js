import UserService from '../services/UserService.js';
import JwtService from '../services/JwtService.js';
import User from '../models/User.js';

const createUser = async (req, res) => {
  try {
    //checkemail
    console.log(req.body);
    const { username, email, password, confirmPassword } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);

    if (!username || !email || !password || !confirmPassword) {
      return res.status(404).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(404).json({
        status: "ERR",
        message: "The input is not email",
      });
    } else if (password !== confirmPassword) {
      return res.status(404).json({
        status: "ERR",
        message: "Password and Confirm Password do not match",
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);
    if (!isCheckEmail) {
      return res.status(404).json({
        status: "ERR",
        message: "This is not a email"
      })
    } else {
      const response = await UserService.login(req.body);
      res.status(200).json(response);
    }
  } catch (error) {
    return res.status(404).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    const token = req.headers.token.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: "ERR",
        message: "Invalid token"
      })
    }

    const response = await JwtService.refreshToken(token);
    res.status(201).json(response);


  } catch (error) {
    return res.status(401).json(error)
  }
}

const getUserInfoByAccessToken = async (req, res) => {
  try {
    console.log('headers', req.headers);
    const token = req.headers.token.split(' ')[1];
    console.log('token', token);
    if (!token) {
      return res.status(404).json({
        status: "ERR",
        message: "Invalid token"
      })
    }

    const response = await UserService.getUserInfoByAccessToken(token);
    res.status(200).json(response);


  } catch (error) {
    return res.status(404).json(error)
  }
}

const getUserInfoById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const response = await UserService.getUserInfoById(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json(error)
  }
}

const updateUserBasicInfo = async (req, res) => {
  try {
    let changes = req.body.changes;
    if (req.file) {
      changes ={
        avatar: req.file.path
      }
    }
    const token = req.headers.token.split(' ')[1];
    const authorizedUser = await UserService.getUserInfoByAccessToken(token);
    const updatedData = await UserService.updateUserBasicInfo(authorizedUser.data._id, changes)
    return res.status(200).json(updatedData);
  } catch (error) {
    return `Error updating user information: ${error.message}`;
  }
}

//get user likes, posts, and friends number
const getUserAnalysticNumber = async (req, res) => {
  try {
    const userId = req.params.userId;
    const response = await UserService.getUserAnalysticNumber(userId);

    return res.status(200).json(response)
  } catch (error) {
    return res.status(404).json(error)
  }
}

const getMatchedUsers = async (req, res) =>{
  try{
    const {limit, offset} = req.query
    const token = req.headers.token.split(' ')[1];
    const response = await UserService.getUserInfoByAccessToken(token);
    const user = response.data;
    
    const MatchedUserList = await UserService.getMatchedUsers(user.location, user.hobbies, user.attractedBy, user._id, limit, offset)
    return res.status(200).json(MatchedUserList)
  } catch (error) {
    return res.status(404).json(error)
  }
}

const sendMatchRequest = async (req, res) => {
  try{
    const targetUserId = req.body.targetUserId;
    const token = req.headers.token.split(' ')[1];
    const response = await UserService.getUserInfoByAccessToken(token);
    const user = response.data;
    
    await UserService.sendMatchRequest(targetUserId , user._id)
    return res.status(200).json({message: 'successful'})
  } catch (error) {
    return res.status(404).json(error)
  }
} 

const findFriendBykeyWord = async(req, res) =>{
  try{
    try {
      const { userId, keyWord } = req.params;
      const user = await User.findById(userId).populate({
        path: 'friends',
        select: 'username _id avatar email'
      });
      
      if (!user) {
        return res.status(404).send('User not found');
      }
      
      const matchedFriends = user.friends.filter(friend =>
        friend.username.toLowerCase().includes(keyWord.toLowerCase())
      ).slice(0, 5);
      
      return res.status(200).json(matchedFriends);
    } catch (error) {
      res.status(500).send(error.message);
    }
    
  } catch (error) {
    return res.status(404).json(error)
  }
}
const getAllUser = async (req, res) => {
  try {
      const result = await UserService.getAllUser();
      res.status(200).json({
          message: "Success",
          user: result
      })
  } catch (error) {
      res.status(500).json({
          message: error.toString()
      })
  }
}
const searchUsers = async (req,res) => {
  try {
    // Tìm kiếm người dùng dựa trên từ khóa
    const keyword = req.params.keyword
    const users = await User.find({
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        // { email: { $regex: keyword, $options: "i" } },
        // { bio: { $regex: keyword, $options: "i" } },
        // { address: { $regex: keyword, $options: "i" } },
      ],
    });

    return res.status(200).json({
      users
    });
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};


const getAllRequestMatches = async(req,res) => {
  try{
    const { id } = req.params;
    const requestMatches = await User.findById(id, 'requestMatch').populate('requestMatch', '_id username avatar');
    
    return res.status(200).json(requestMatches)
  } catch (error) {
    return res.status(404).json(error)
  }
}

const accRequestMatch = async(req,res) => {
  try{
    const { sender, receiver } = req.body;

    
    const requestMatches = await User.findByIdAndUpdate(sender, {
      $addToSet: {
        friends: receiver
      },
      $pull: {
        requestMatch: receiver
      }
    })

    const requestMatchesForReceiver = await User.findByIdAndUpdate(receiver, {
      $addToSet: {
        friends: sender
      },
      $pull: {
        requestMatch: sender
      }
    })
    
    return res.status(200).json(requestMatches)
  } catch (error) {
    return res.status(404).json(error)
  }
}

const deleteRequestMatch = async(req,res) => {
  try{
    const { sender, receiver } = req.body;

    const requestMatches = await User.findByIdAndUpdate(sender, {
      $pull: {
        requestMatch: receiver
      }
    })

    return res.status(200).json(requestMatches)
  } catch (error) {
    return res.status(404).json(error)
  }
}

const getAllFriends = async(req,res) => {
  try{
    const { userId } = req.params;

    const friends = await User.findById(userId, 'friends').populate('friends', 'username avatar');

    return res.status(200).json(friends);
  } catch (error) {
    return res.status(404).json(error)
  }
}

const getAllUserAdmin = async(req,res) => {
  try{

    const users = await User.find({isAdmin: {$ne: true}}, 'username avatar isBan email');

    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json(error)
  }
}

const updateIsBan = async(req,res) => {
  try{
    const { userId, isBan} = req.body;
    const users = await User.findByIdAndUpdate(userId, {
      isBan: isBan
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json(error)
  }
}

const insertUuid = async(req,res) => {
  try{
    const { email, uuid} = req.body;
    const users = await User.findOneAndUpdate({email: email}, {
      uuid: uuid
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json(error)
  }
}

const updatePassword = async (req, res) => {
  try {
    //checkemail
    console.log('abc', req.body);
    const { email, password, confirmPassword, uuid } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);

    if ( !email || !password || !confirmPassword || !uuid) {
      return res.status(404).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (password !== confirmPassword) {
      return res.status(404).json({
        status: "ERR",
        message: "Password and Confirm Password do not match",
      });
    }
    const response = await UserService.updatePassword(req.body);
    console.log('response', response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json(error);
  }
};

export {
  createUser,
  login,
  refreshToken,
  getUserInfoByAccessToken,
  getUserAnalysticNumber,
  updateUserBasicInfo,
  getUserInfoById,
  getMatchedUsers,
  sendMatchRequest,
  findFriendBykeyWord,
  getAllUser,
  searchUsers,
  getAllRequestMatches,
  accRequestMatch,
  deleteRequestMatch,
  getAllFriends,
  getAllUserAdmin,
  updateIsBan,
  insertUuid,
  updatePassword
};

export default {
  createUser,
  login,
  refreshToken,
  getUserInfoByAccessToken,
  getUserAnalysticNumber,
  updateUserBasicInfo,
  getUserInfoById,
  getMatchedUsers,
  sendMatchRequest,
  findFriendBykeyWord,
  getAllUser,
  searchUsers,
  getAllRequestMatches,
  accRequestMatch,
  deleteRequestMatch,
  getAllFriends,
  getAllUserAdmin,
  updateIsBan,
  insertUuid,
  updatePassword
};