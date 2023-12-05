'use client'
import { global_userList, updateUserList } from "./factory/factory_user";

export default function Home() {

  async function updateUseList(){

    await updateUserList();

  }

  return (
    <div>
      <button onClick={updateUseList}>UPDATE</button>
    </div>
  )
}