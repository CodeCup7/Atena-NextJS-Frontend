'use client'
import { api_rateM_getById } from "@/app/api/rateM_api";
import { Type_RateCC } from "@/app/classes/enums";
import { RateM } from "@/app/classes/rateM";
import { CreateNewEmptyRateM } from "@/app/factory/factory_rateM";
import { KeyObject } from "crypto";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const Test = () => {
  
  const typeRateKey: string | undefined = Object.keys(Type_RateCC).find(
    key => (Type_RateCC as Record<string, string>)[key] === '1'
  );
  
  const typeRate: string = typeRateKey || '';
  console.log('typeRateKey :', typeRateKey);
  






  return (
    <div>

    </div>
  );
};

export default Test;
