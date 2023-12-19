'use client'
import { updateUserList } from "./factory/factory_user";
import React from "react";
import { Input } from "@nextui-org/react";

export default function Home() {

  async function updateUseList() {
    await updateUserList();
  }

  return (
    <div>
      <button onClick={updateUseList}>UPDATE</button>


    </div>
  )
}