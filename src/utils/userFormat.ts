export const formatUserResponse = (user: any) => {
  console.log(user)
  const { password, ...userWithoutPassword } = user[0];
  return userWithoutPassword;
};
