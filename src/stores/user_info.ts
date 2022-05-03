import { observable, action, computed, makeObservable, runInAction } from "mobx";
import { UserInfo, UserInfoApis } from "@/apis/user_info";
import avatar from "@/assets/avatar.png";

class UserInfoStore {
  userInfo: UserInfo = undefined

  constructor() {
    makeObservable(this, {
      userInfo: observable,
      fetchUserInfo: action,
    });
  }

  fetchUserInfo(params) {
    return UserInfoApis
    .getUserInfo(params)
    .then(
      resp => {
        if (resp.status_code == 0) {
          runInAction(() => {
            this.userInfo = resp.user_info;
            this.userInfo.avatar_url = avatar  
          })
        }
      }
    );
  }

  resetUserInfo() {
    this.userInfo = null
  }
}

export const userInfoStore = new UserInfoStore();