const Op = require('sequelize').Op;
const User = require('../models').User;

// const authStore = useAuthStore();
export const loginUser = async (loginData: {
  login: string;
  password: string;
}) => {
  const user = await User.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [{ user_name: loginData.login }, { email: loginData.login }],
        },
        { password: loginData.password },
      ],
      // [Op.or]: [{ a: 5 }, { b: 6 }],
    },
  });
  if (user && user.password == loginData.password) {
    // return user;
    return {
      full_name: user.full_name,
      email: user.email,
      user_name: user.user_name,
      user_group: user.user_group_id,
    };
  } else {
    return null;
  }
};
