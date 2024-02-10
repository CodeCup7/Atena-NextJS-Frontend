'use client'

import { api_NoteCC_add } from "@/app/api/noteCC_api";
import { api_rateCC_add, api_rateCC_getAllRateNoNote, api_rateCC_getById, api_rateCC_update } from "@/app/api/rateCC_api";
import { NoteCC } from "@/app/classes/rates/noteCC";
import { RateCC } from "@/app/classes/rates/rateCC";
import { Role, User } from "@/app/classes/user";
import { CreateNewEmptyRatePart } from "@/app/factory/factory_ratePart";
import { key_w1, key_o1, key_t1, key_t2, key_t3, key_t4, key_k1, key_k2, key_k3, key_s1, key_s2, key_s3, key_s4 } from "@/app/globalKeys";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Test = () => {

  function putNewRateCC() {
    let rateCC: RateCC = new RateCC();
    rateCC.agent.id = 8
    rateCC.coach.id = 2
    rateCC.queue.id = 1
    rateCC.dateRate = new Date().toLocaleDateString('en-CA');
    rateCC.wiedzaBlock.ratePart.push(CreateNewEmptyRatePart(key_w1));
    rateCC.obslugaBlock.ratePart.push(CreateNewEmptyRatePart(key_o1));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t1));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t2));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t3));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t4));
    rateCC.komunikacjaBlock.ratePart.push(CreateNewEmptyRatePart(key_k1));
    rateCC.komunikacjaBlock.ratePart.push(CreateNewEmptyRatePart(key_k2));
    rateCC.komunikacjaBlock.ratePart.push(CreateNewEmptyRatePart(key_k3));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s1));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s2));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s3));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s4));
    return rateCC;
  }

  async function puntNewNoteCC(){

    let note:NoteCC = new NoteCC();
    const rateCC = await api_rateCC_getById(1);
    rateCC.idCall = 'NOTE RATE SRATE'
    note.agent.id = 8;
    note.coach.id = 2;
    note.rateCC_Col.push(rateCC);
    //note.rateCC_Col.push(putNewRateCC());

    return note;

  }


  async function getData() {

   // await api_NoteCC_add(await puntNewNoteCC())
    //await api_rateCC_update(rateCC)
    api_rateCC_add(putNewRateCC())
    console.log('rateCC :', putNewRateCC());

  }

  return (
    <div>
      <button className="btn btn-info" onClick={getData}>PRZYCISK</button>
    </div>
  );
};

export default Test;
