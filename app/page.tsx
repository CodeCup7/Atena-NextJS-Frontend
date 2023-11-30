'use client'
import { api_rateCC_add } from "./api/rateCC_api";
import { api_rateBlock_add } from "./api/rateBlock_api";
import { api_User_add } from "./api/user_api";
import { RateBlock } from "./classes/rateBlock";
import { RateCC } from "./classes/rateCC";
import { RatePart } from "./classes/ratePart";
import { User } from "./classes/user";
import { CreateNewEmptyRateCC } from "./factory/factory_rateCC"
import { CreateNewEmptyRatePart } from "./factory/factory_ratePart";
import { CreateNewEmptyUser } from "./factory/factory_user";
import { key_w1 } from "./globalKeys";
import { serialize } from 'class-transformer'

export default function Home() {

  const ratePart: RatePart = CreateNewEmptyRatePart(key_w1);
  const rateBlock: RateBlock = new RateBlock(key_w1);
  let rate: RateCC = CreateNewEmptyRateCC();


  function rateBtn_Click() {
    console.log(rate.typeRate)
    api_rateCC_add(rate);
  }
  function userBtn_Click() {
    api_User_add(CreateNewEmptyUser());
  }

  function rateBlockBtn_Click() {
    api_rateBlock_add(rateBlock);
  }


  return (
    <div>
      <button onClick={rateBtn_Click}>CLICK RateCC</button>
      <br></br>
      <button onClick={userBtn_Click}>CLICK User</button>
      <br></br>
      <button onClick={rateBlockBtn_Click}>CLICK Rate Block</button>
    </div>
  )
}