'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Role, User } from '@/app/classes/user';
import { updateUserList } from '@/app/factory/factory_user';
import { api_Feedback_add, api_Feedback_delete, api_Feedback_getDate } from '@/app/api/feedback_api';
import { Feedback, FeedbackLabels, Feedback_type } from '@/app/classes/feedback';
import { format } from 'date-fns';
import { calculateStartEndDate } from '@/app/global';
import { IconAdd, IconCalendar, IconDelete, IconDownload, IconFeedbackDown, IconFeedbackUp } from '../../components/icons/icons';

const Feedback_Page = () => {

    // ====== Hooks =====================================================================================================================================================================================================================
    const [userList, setUserList] = useState<Array<User>>([]);
    const [feedbackList, setFeedbackList] = useState<Array<Feedback>>([]);
    const [feedback, setFeedback] = useState(new Feedback());
    const [rowIndex, setRowIndex] = useState(-1);
    const [dateValue, setDateValue] = useState('');
    const [agentId, setAgentId] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await updateUserList();
                setUserList(users);
                setFeedback(new Feedback())

            } catch (error) {
                toast.error('Błąd pobierania użytkowników', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                console.log('Błąd pobierania użytkowników', error);
            }
        }
        fetchData();
    }, []);

    // ====== Akcje =====================================================================================================================================================================================================================
    function downloadDate_Click() {

        if (dateValue !== null && dateValue !== undefined && dateValue !== "") {

            async function fetchData() {
                try {
                    const { startDate, endDate } = calculateStartEndDate(dateValue + '-01', 0);
                    const feedbackList = await api_Feedback_getDate(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
                    setFeedbackList(feedbackList);

                } catch (error) {
                    toast.error('Błąd pobierania feedbacków', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    console.error('Błąd pobierania feedbacków:', error);
                }
            }
            fetchData();

        } else {
            toast.error("Wybierz datę!", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
    }

    function addFeedback_click(): boolean {

        if (validate()) {

            api_Feedback_add(feedback).then((foo => {
                if (foo.isOK === true) {
                    setFeedbackList((prevFeedbackList) => [...prevFeedbackList, foo.feedback]);
                    toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    return true;
                } else {
                    toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                }
            }));

        } else {
            toast.error("Uzupełnij poprawnie wszystkie pola", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
        return false;
    }

    function deleteFeedback_click(feedback_: Feedback) {
        api_Feedback_delete(feedback_).then((foo => {
            if (foo.isOK === true) {
                setFeedbackList((prevFeedbackList) => prevFeedbackList.filter((feedback) => feedback.id !== feedback_.id));
                toast.info(foo.callback, {
                    position: toast.POSITION.TOP_RIGHT, theme: "dark"
                });
                return true;
            } else {
                toast.error(foo.callback, {
                    position: toast.POSITION.TOP_RIGHT, theme: "dark"
                });
            }
        }));
    }

    // ====== Obsługa modala =====================================================================================================================================================================================================================
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


    // ====== Funkcje =====================================================================================================================================================================================================================
    function validate(): boolean {
        if (feedback.agent.id !== 0 && feedback.dateFeedback !== '' && feedback.feedback !== Feedback_type.ALL_) {
            return true;
        } else {
            return false;
        }
    }

    // ====== HTML ========================================================================================================================================================================================================================
    return (
        <div className='container mx-auto w-full border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />

            {/* NAGŁÓWEK */}
            <div className='flex items-center justify-center'>
                <IconFeedbackUp size={12} className='text-info' /><IconFeedbackDown size={12} className='text-info' />
                <h1 className='text-4xl text-info mb-4 ml-2'>Pochwały i skargi</h1>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* POBIERANIE I DODAWANIE */}
            <div className='flex mt-5'>

                <div className='flex'>
                    <IconCalendar size={16} className='text-info mr-2' />
                    <input
                        value={dateValue}
                        onChange={e => { setDateValue(e.currentTarget.value); }}
                        type="month"
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs" />
                    <button onClick={downloadDate_Click} className="btn btn-outline btn-info mx-2">
                        <IconDownload />
                        Pobierz dane
                    </button>
                </div>

                <button className="btn btn-outline btn-info mx-2" onClick={openModal}>
                    <IconAdd />
                    Dodaj feedback
                </button>
            </div>

            {/* MODAL */}
            <dialog id="my_modal_1" className="modal" ref={modalRef}>
                <div className="modal-box">
                    <div className="flex flex-col items-center justify-center ml-10">
                        <span className='text-info'>Dodaj pochwałę lub skargę</span>
                        <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>
                        <div className="flex flex-col mt-5">
                            <span className="label-text">Data</span>
                            <input type="date"
                                className="input input-bordered input-info min-w-fit"
                                defaultValue={feedback.dateFeedback}
                                onChange={e => feedback.dateFeedback = e.target.value} />
                        </div>
                        <div className="flex flex-col mt-2">
                            <span className="label-text">Rodzaj</span>
                            <select
                                className="select select-info w-72"
                                value={feedback.feedback}
                                onChange={e => {
                                    setFeedback({ ...feedback, feedback: Object.values(Feedback_type).find(feedbackType => feedbackType === e.target.value) || Feedback_type.POSITIVE_ });
                                }}>
                                <option value={Feedback_type.ALL_} disabled>Wybierz feedback ...</option>
                                <option key={1} value={Feedback_type.POSITIVE_}>{FeedbackLabels[Feedback_type.POSITIVE_]}</option>
                                <option key={2} value={Feedback_type.NEGATIVE_}>{FeedbackLabels[Feedback_type.NEGATIVE_]}</option>
                            </select>
                        </div>
                        <div className="flex flex-col mt-2">
                            <span className="label-text">Agent</span>
                            <select
                                className="select select-info w-72"
                                value={feedback.agent.id}
                                onChange={e => {
                                    feedback.agent = userList.find(user => user.id === parseInt(e.target.value)) || new User()
                                    setAgentId(parseInt(e.target.value))
                                }}>
                                <option value={0} disabled>Wybierz agenta ...</option>
                                {userList.filter(user => user.role === Role.AGENT_).map((user) => (
                                    <option key={user.id} value={user.id}>{user.nameUser}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-outline btn-info mt-5"
                            onClick={() => {
                                if (addFeedback_click()) {
                                    closeModal
                                }
                            }}>
                            <IconAdd />
                            Dodaj
                        </button>
                    </div>
                    <div className="modal-action">
                        {/* Close the modal using the closeModal function */}
                        <button className="btn" onClick={closeModal}>
                            Zamknij
                        </button>
                    </div>
                </div>
            </dialog>

            {/* TABELA */}
            <div className='flex sm:flex-col md:flex-row'>

                <div className="table">
                    <table className="table table-pin-rows ">
                        <thead>
                            <tr>
                                <th className=''>id</th>
                                <th className=''>data</th>
                                <th>agent</th>
                                <th>rodzaj</th>
                            </tr>
                        </thead>
                        <tbody className="table-auto overflow-scroll w-full" >
                            {feedbackList.map((feedback, index) => {
                                return (
                                    <tr key={index}
                                        className={`hover:bg-base-300  hover:text-white cursor-pointer ${index === rowIndex ? 'bg-slate-950 text-white' : ''
                                            } cursor-pointer`}>
                                        <td>{feedback.id}</td>
                                        <td>{feedback.dateFeedback}</td>
                                        <td>{feedback.agent.nameUser}</td>
                                        <td>{FeedbackLabels[feedback.feedback]}</td>
                                        <td><button className="btn btn-outline btn-warning btn-sm"
                                            onClick={() => {
                                                deleteFeedback_click(feedback)
                                            }}>
                                            <IconDelete />
                                            Usuń
                                        </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Feedback_Page