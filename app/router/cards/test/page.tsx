'use client'

import { api_rateCC_getAllRateNoNote } from "@/app/api/rateCC_api";
import { Role, User } from "@/app/classes/user";
import { useEffect, useState } from "react";

export const Test = () => {


  const rateList = api_rateCC_getAllRateNoNote();
  console.log('rateList :', rateList);
  


  return (
    <div>
      
    </div>
  );
};

export default Test;
