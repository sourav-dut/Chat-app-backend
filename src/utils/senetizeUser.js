export const senetizeUser = (user) => {
    return {_id: user._id, fullName: user.fullName, email: user.email, phone: user.phone}
};