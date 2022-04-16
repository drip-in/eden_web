import { observable, action, computed, makeObservable} from "mobx";
import { UserInfo } from "@/apis/user_info";
import avatar from "@/assets/avatar.png";

class UserInfoStore {
  userInfo: UserInfo = undefined

  constructor() {
    makeObservable(this, {
      userInfo: observable,
      fetchUserInfo: action,
    });
  }

  fetchUserInfo() {
    // this.userInfo = {
    //   avatar_url: avatar,
    //   level: 1,
    //   eden_uid: "123",
    //   nick_name: "turling",
    // };
    this.userInfo = undefined
  }
}

export const userInfoStore = new UserInfoStore();