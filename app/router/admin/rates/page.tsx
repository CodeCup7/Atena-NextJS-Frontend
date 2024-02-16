'use client'
import React, { useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api_rateCC_delete } from '@/app/api/rateCC_api';
import { api_rateM_delete } from '@/app/api/rateM_api';

const Rates_Page = () => {

    // ====== Hooks =========================================================
    const [type, setType] = useState(0); // 1 rateCC, 2 rateM
    const [id, setId] = useState(''); // 1 rateCC, 2 rateM

    // ====== Akcje ====================================================== 
    async function deteleRateCC() {
        api_rateCC_delete(parseInt(id)).then((foo => {
            if (foo.isOK === true) {
                toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
            } else {
                toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
            }
        }));
    }
    async function deteleRateM() {
        api_rateM_delete(parseInt(id)).then((foo => {
            if (foo.isOK === true) {
                toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
            } else {
                toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
            }
        }));
    }

    // ====== Obsługa modala =========================================================
    const modalRef = useRef<HTMLDialogElement>(null);

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
        }
    };

    // ====== HTML =================================================================
    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
            <div className='flex flex-col gap-2'>

            </div>
            <button className="btn btn-outline btn-error" onClick={() => {
                setType(1);
                openModal();
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Usuń ocenę dowolnej rozmowy
            </button>

            <button className="btn btn-outline btn-error ml-4" onClick={() => {
                setType(2);
                openModal();
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Usuń ocenę maila
            </button>

            {/* MODAL */}
            <dialog id="my_modal_1" className="modal" ref={modalRef}>
                <div className="modal-box">
                    <div className="flex flex-col items-center justify-center ml-10">
                        <span className='text-info'>{type === 1 ? "Usuń ocenę rozmowy" : "Usuń ocenę maila"}</span>
                        <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

                        <div className='flex flex-col mx-6 mb-6'>
                            <label className="form-control w-full max-w-xs mt-2">
                                <div className="label">
                                    <span className="label-text">{type === 1 ? "Usuń ocenę rozmowy" : "Usuń ocenę maila"}</span>
                                </div>
                                <input
                                    className="input input-bordered input-info max-w-md gap-y-2 w-72"
                                    type="number"
                                    placeholder="id oceny"
                                    onChange={e => setId(e.target.value)} />
                            </label>
                            <button
                                onClick={() => {
                                    type === 1 ? deteleRateCC() : deteleRateM();

                                }}
                                className='btn btn-outline btn-warning mt-5'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Usuń
                            </button>
                        </div>
                    </div>
                    <div className="modal-action">
                        {/* Close the modal using the closeModal function */}
                        <button className="btn" onClick={closeModal}>
                            Zamknij
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default Rates_Page
