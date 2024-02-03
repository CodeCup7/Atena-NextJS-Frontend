'use client'
import { api_rateM_getById } from "@/app/api/rateM_api";
import { RateM } from "@/app/classes/rateM";
import { CreateNewEmptyRateM } from "@/app/factory/factory_rateM";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const Test = () => {

  const [rateM, setRateM] = useState(new RateM());
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {

    async function fetchData() {
      try {
        const rate: RateM = await api_rateM_getById(19)
        setRateM(rate);

      } catch (error) {
        console.log('Błąd useEffect', error);
      }
    }
    fetchData();

  })

  function download() {
    const filename = '19_fv.pdf'
    window.location.href = `http://localhost:8080/api/rateM/getAttachment?fileName=${filename}`;
  }

  return (
    <div>

      <div>
        <input type="text" className="file-input file-input-bordered file-input-info w-full max-w-xs"
          value={rateM.attachmentPath}>
        </input>
        <button onClick={download}>Download</button>
      </div>


    </div>
  );
};

export default Test;
