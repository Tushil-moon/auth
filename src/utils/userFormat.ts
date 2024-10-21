export const formatUserResponse = (user: any) => {
    const { password, ...userWithoutPassword } = user; // Destructure to exclude password
    return userWithoutPassword; // Return the user object without the password
  };