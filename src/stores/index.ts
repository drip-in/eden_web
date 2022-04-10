import React from "react";
import {configure} from 'mobx';
import { userInfoStore } from "./user_info";

configure({enforceActions: 'always'})


export const stores = {
  userInfoStore,
};

export const StoreContext = React.createContext(stores)
export type IStore = ReturnType<typeof useStores>
export const useStores = () => React.useContext(StoreContext)

