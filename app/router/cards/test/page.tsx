'use client'
import { CreateNewEmptyRateCC } from '@/app/factory/factory_rateCC';
import { Rate_Mode } from '@/app/classes/enums';
import { Queue } from '@/app/classes/queue';
import { User } from '@/app/classes/user';
import { queueList } from '@/app/factory/factory_queue';
import { userList_ } from '@/app/factory/factory_user';
import { key_w1 } from '@/app/globalKeys';
import Link from 'next/link';
import { RateCC } from '@/app/classes/rateCC';

export let selectedRateCC: RateCC = CreateNewEmptyRateCC();

export const Test = () => {
  // TESTY
  const rateCC: RateCC = CreateNewEmptyRateCC();
  rateCC.$queue = queueList.find(e => e.$nameQueue === "Cennik") || new Queue();
  rateCC.$mode = Rate_Mode.PREVIEW_;
  rateCC.$extraScore = -7;
  rateCC.$agent = userList_.find((user) => user.$nameUser == "6_Szymon") || new User;
  rateCC.$coach = userList_.find((user) => user.$nameUser == "1_Szymon") || new User;
  rateCC.$idCall = "1234567";
  rateCC.$dateRate = "2023-01-01"
  rateCC.$dateCall = "2022-08-07"
  rateCC.$wiedzaBlock.$ratePartCol.find(part => part.$key === key_w1 ? part.$nieprawidlowosci = "TEST" : "");
  rateCC.$wiedzaBlock.$ratePartCol.find(part => part.$key === key_w1 ? part.$ocena = 0 : 0);
  rateCC.$id = 100;

  console.log(rateCC.$wiedzaBlock.$ratePartCol.find(part => part.$key === key_w1));

  const onPrev = true;
  selectedRateCC = rateCC

  return (
    <div className='flex flex-col gap-8 grow'>
      <div className='flex flex-col '>

        <Link href={{ pathname: '/router/cards/rateCC', query: { onPrev }, }}> PREVIEW </Link>
        <div>
          <Link href={'/router/cards/rateCC'}> NEW </Link>
        </div>


      </div>
    </div>
  );
};

export default Test;
