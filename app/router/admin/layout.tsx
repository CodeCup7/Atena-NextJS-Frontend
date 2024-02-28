'use client'
import Link from 'next/link'
import React from 'react'
import { IconAdmin, IconAdvanced, IconFeedbackUp, IconQueue, IconRates, IconTest, IconUsers } from '../components/icons/icons'

export default function Administracja({
    children,
}: {
    children: React.ReactNode
    params: {
        tag: string
        item: string
    }
}) {

    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2'>
            <div className='flex items-center justify-center'>
                <IconAdmin size={12} className='text-info' />

                <h1 className='text-info text-3xl text-center ml-3'> Administracja</h1>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>
            <div className='flex items-center justify-center p-2'>
                <div className=' p-2'>
                    <Link className="flex text-info text-sm btn btn-outline btn-info btn-md" href="/router/admin/user">
                        <IconUsers />
                        <h1 className='ml-2'>Użytkownicy</h1>
                    </Link>
                </div>
                <div className='p-2'>
                    <Link className="flex group text-info text-sm btn btn-outline btn-info btn-md" href="/router/admin/queue">
                        <IconQueue />
                        <h1 className='ml-2'>Kolejki</h1>
                    </Link>
                </div>
                <div className='p-2'>
                    <Link className="flex group text-info text-sm btn btn-outline btn-info btn-md" href="/router/admin/rates">
                        <IconRates />
                        <h1 className='ml-2'>Oceny</h1>
                    </Link>
                </div>
                <div className='p-2'>
                    <Link className="flex group text-info text-sm btn btn-outline btn-info btn-md" href="/router/admin/testy">
                        <IconTest />
                        <h1 className='ml-2'>Testy</h1>
                    </Link>
                </div>
                <div className='p-2'>
                    <Link className="flex group text-info text-sm btn btn-outline btn-info btn-md" href="/router/admin/user">
                        <IconFeedbackUp />
                        <h1 className='ml-2'>Feedback</h1>
                    </Link>
                </div>
                <div className='p-2'>
                    <Link className="flex group text-info text-sm btn btn-outline btn-info btn-md" href="/router/admin/user">
                        <IconAdvanced />
                        <h1 className='ml-2'>Zaawansowane</h1>
                    </Link>
                </div>
            </div>
            <div className='w-full mt-5'>
                {children}
            </div>

        </div>
    )
}
