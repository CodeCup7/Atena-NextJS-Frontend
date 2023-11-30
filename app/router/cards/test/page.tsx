'use client'
import { CreateNewEmptyRateCC } from '@/app/factory/factory_rateCC';
import { Rate_Mode, Type_RateCC } from '@/app/classes/enums';
import { Queue } from '@/app/classes/queue';
import { Role, User } from '@/app/classes/user';
import { queueList } from '@/app/factory/factory_queue';
import { userList_ } from '@/app/factory/factory_user';
import { key_w1 } from '@/app/globalKeys';
import Link from 'next/link';
import { RateCC } from '@/app/classes/rateCC';
import UserDetailsDialog from '../../components/dialog/UserDetailsDialog';

export let selectedRateCC: RateCC = CreateNewEmptyRateCC();

export const Test = () => {


  const list = ["Tak", "Nie"]


  return (
    <div>


      <UserDetailsDialog open={true} onConfirm={function (): void {
        throw new Error('Function not implemented.');
      } } onEdit={false} user={new User}/>
    </div>

  );
};

export default Test;
