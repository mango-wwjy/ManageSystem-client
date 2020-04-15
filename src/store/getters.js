const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userName: state => state.user.userName,
  realName: state => state.user.realName,
  userEmail: state => state.user.userEmail,
  userPhone: state => state.user.userPhone,
  authId: state => state.user.authId,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
}
export default getters
