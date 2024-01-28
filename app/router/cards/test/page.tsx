'use client'

import { api_NoteCC_add } from "@/app/api/noteCC_api";
import { api_rateCC_add, api_rateCC_getAllRateNoNote, api_rateCC_getById, api_rateCC_update } from "@/app/api/rateCC_api";
import { NoteCC } from "@/app/classes/noteCC";
import { RateCC } from "@/app/classes/rateCC";
import { Role, User } from "@/app/classes/user";
import { CreateNewEmptyRatePart } from "@/app/factory/factory_ratePart";
import { key_w1, key_o1, key_t1, key_t2, key_t3, key_t4, key_k1, key_k2, key_k3, key_s1, key_s2, key_s3, key_s4 } from "@/app/globalKeys";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Test = () => {

  const date = [
    {
      "key": "appliesDate",
      "operation": "BETWEEN",
      "value": "2024-02-01 AND 2024-02-28"
    }
  ]


  async function getData() {

    console.log(JSON.stringify(date))

    try {
      const response = await fetch('http://localhost:8080/api/noteCC/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(date)
      });

      return await response.json();
    } catch (error) {
      return [];
    }


  }

  return (
    <div>
      <button className="btn btn-info" onClick={getData}>PRZYCISK</button>
    </div>
  );
};

export default Test;
