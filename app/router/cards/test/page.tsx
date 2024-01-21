'use client'

import { api_rateCC_getAllRateNoNote } from "@/app/api/rateCC_api";
import { RateCC } from "@/app/classes/rateCC";
import { Role, User } from "@/app/classes/user";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Test = () => {

  let rateList = [];
  let selectedRateCC
  let toJSON;
  let fromJSON;

  getData();

  async function getData() {
    rateList = await api_rateCC_getAllRateNoNote();
    selectedRateCC = rateList.find(rate => rate.queue.nameQueue === "Kolejka 2")
    localStorage.setItem('rateCC_prev', JSON.stringify(selectedRateCC));
    
  }

  return (
    <div>
      <Link className="group link link-info link-hover text-lg"
        href={{
          pathname: "/router/cards/rateCC",
          query: { rateData: JSON.stringify(selectedRateCC) }

        }}>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 stroke-info group-hover:stroke-blue-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <span className="ml-2">Karta rozmowy</span>
        </div>
      </Link>
    </div>
  );
};

export default Test;
