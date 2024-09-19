// Initialize an empty object that will store the user data
let user = {};

const saveUser = (userData) => {
  if (!userData) {
    throw new Error('User data is required');
  }

  // Save the user data into the user object
  user = {
    id: userData.id,
    userName: userData.userName,
    email: userData.email,
    role: userData.role,
    photo: userData.photo
  };
};

const getUser = () => {
  // Return the stored user object
  return user;
};

module.exports = { saveUser, getUser };
