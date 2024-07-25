import User from "../models/User.js";
import HobbyService from "../services/HobbyService.js";

const getAllHobby = async (req, res) =>{
  try {
    let query = "query { folders (workspace_ids: 6404069) { name id children { id name }}}";

   const response = await fetch ("https://api.monday.com/v2", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI5Njg5OTA5MCwiYWFpIjoxMSwidWlkIjo1MTUzOTA4MiwiaWFkIjoiMjAyMy0xMS0xN1QwNzoxMDozOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTY2OTUxMjMsInJnbiI6InVzZTEifQ.2iuavWH4Uc_gsAGwJJgIKX2Bu7Zw2XwiAXYbrWbaj-Y'
       },
       body: JSON.stringify({
         'query' : query
       })
      })
  const data = await response.json();
  const board = data.data.folders.flatMap((item) => item.children);
 const query2 = `{ boards(ids: [${board.map((b) => b.id).join(" ")}]) { items_page(limit: 23) { cursor items { id name  column_values { id type text value ... on MirrorValue { mirrored_items { linked_item { id name column_values { id text }} } } } } } } }`
let indices = Array.from({ length: Math.ceil(listboard.length / 5) }, (_, i) => i * 5)

  // const fetchData = indices.map((item) => {
    const fetchData = await getListByQuery(`{ boards(ids: [${board.map((b) => b.id).slice(0, 5).join(" ")}]) { items_page(limit: 23) { cursor items { id name  column_values { id type text value ... on MirrorValue { mirrored_items { linked_item { id name column_values { id text }} } } } } } } }`);
  // })
  // Promise.all(fetchData).then((res) => {
  //   const list = res.data.data?.boards.flatMap((i) => i.items_page.items);
  //   // res.status(response.status).json(list);
  // }).catch((err) => {
  // res.status(500).json({ message: 'Internal Server Error' });

  // })
  res.status(response.status).json(fetchData);
} catch (error) {
  res.status(500).json({ message: 'Internal Server Error' });
}
}
const getListByQuery = async (query) => {
  const apiUrl = 'https://api.monday.com/v2';
  try {
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI5Njg5OTA5MCwiYWFpIjoxMSwidWlkIjo1MTUzOTA4MiwiaWFkIjoiMjAyMy0xMS0xN1QwNzoxMDozOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTY2OTUxMjMsInJnbiI6InVzZTEifQ.2iuavWH4Uc_gsAGwJJgIKX2Bu7Zw2XwiAXYbrWbaj-Y",
      },
      body: JSON.stringify({ query }),
    });
  
    const result = await response.json();
    // res.status(response.status).json(result);
    return result;
  } catch (error) {
    // res.status(500).json({ message: 'Internal Server Error' });
    return false
  }
}
const getAllHobbyByKeyWord = async (req, res) =>{
    try{
        const keyWord = req.params.keyWord;
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;
        const hobbies = await HobbyService.getAllHobbyByKeyWord(limit, offset, keyWord);
        return res.status(200).json({
            message: "get posts success ccc",
            data: hobbies
        })
    }catch (error) {
        res.status(500).json({
            messages: error.toString()
        })
    }
}
const testPostman = async (req, res) => {
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
        const response = await HobbyService.createUser(req.body);
        return res.status(200).json(response);
      } catch (error) {
        return res.status(404).json(error);
      }
}
const getAllUser = async (req, res) => {
  try{
    const user = await HobbyService.getAllUser();
    return res.status(200).json({
        message: "get user success aaaa",
        data: user
    })
}catch (error) {
    res.status(500).json({
        messages: error.toString()
    })
}
}
const updateUserBasicInfo = async (req, res) => {
  try {
    let changes = req.body.changes;
    // const authorizedUser = await UserService.getUserInfoByAccessToken(token);
    const updatedData = await HobbyService.updateUserBasicInfo(changes._id, changes)
    return res.status(200).json(updatedData);
  } catch (error) {
    return `Error updating user information: ${error.message}`;
  }
}
const getUserByID = async (req, res) => {
  try {
    const data = await HobbyService.getUserByID(req.params.user_id);
    return res.status(200).json(data)
  }catch(error) {
    return `${error.message}`
  }
}
const updatePassword = async (req, res) => {
  try {
    //checkemail
    console.log('abc', req.body);
    const { email, password, confirmPassword } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);

    if ( !email || !password || !confirmPassword) {
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
    const response = await HobbyService.updatePassword(req.body);
    console.log('response', response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json(error);
  }
};
const updateIsBan = async(req,res) => {
  try{
    const { user_id, isBan} = req.body;
    console.log(req.body);
    const users = await User.findByIdAndUpdate(user_id, {
      isBan: isBan
    });
    const data = await User.findById(user_id).select('-password')
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json(error)
  }
}
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
      const response = await HobbyService.login(req.body);
      res.status(200).json(response);
    }
  } catch (error) {
    return res.status(404).json(error)
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
const getAllBoard = async() => {
  try {
    let query = "query { folders (workspace_ids: 6404069) { name id children { id name }}}";

   const response = await fetch ("https://api.monday.com/v2", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI5Njg5OTA5MCwiYWFpIjoxMSwidWlkIjo1MTUzOTA4MiwiaWFkIjoiMjAyMy0xMS0xN1QwNzoxMDozOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTY2OTUxMjMsInJnbiI6InVzZTEifQ.2iuavWH4Uc_gsAGwJJgIKX2Bu7Zw2XwiAXYbrWbaj-Y'
       },
       body: JSON.stringify({
         'query' : query
       })
      })
  const data = await response.json();
  res.status(response.status).json(data);
} catch (error) {
  res.status(500).json({ message: 'Internal Server Error' });
}
}
export default{
    getAllHobby,
    getAllHobbyByKeyWord,
    testPostman,
    getAllUser,
    updateUserBasicInfo,
    getUserByID,
    updatePassword,
    updateIsBan,
    login,
    getUserInfoByAccessToken,
    getAllBoard
}