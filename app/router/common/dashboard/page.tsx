'use client'
import { getActiveUser } from '@/app/auth';
import { Role, User } from '@/app/classes/user';
import { updateUserList } from '@/app/factory/factory_user';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Dashboard_DoughnutChart } from '../../components/chart/dashboard_chartDoughnut';
import { Dashboard_LineChart } from '../../components/chart/dashboard_chartLine';
import { FinalScore } from '@/app/classes/finalScore';
import { getFinalScore, getFinalScoreData, getFinalScoreFeedback, getFinalScoreMysteryAndCurrent, getFinalScoreRateCCAndRateM, getFinalScoreTests } from '@/app/factory/factory_dashboard';
import { NoteCC } from '@/app/classes/rates/noteCC';
import { getNoteCC_Rate } from '@/app/factory/factory_noteCC';

const Dashboard = () => {

  // ====== Hooks =====================================================================================================================================================================================================================
  const [isPermit, setIsPermit] = useState(false);
  const [activeUser, setActiveUser] = useState(new User());
  const [userList, setUserList] = useState<Array<User>>([]);
  const [dateAgent, setDateAgent] = useState('');
  const [agentId, setAgentId] = useState(0);
  const [agentName, setAgentName] = useState('');

  // Pobrane dane
  const [finalPeriod, setFinalPeriod] = useState(new FinalScore()); // Wszytskie dane z 3 ost. miesięcy
  const [final, setFinal] = useState(new FinalScore()); // Wybrany miesiąc

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await updateUserList();
        const user = await getActiveUser();
        setActiveUser(user);
        setUserList(users);

        // Walidacja roli. Możliwość pobrania tylko swoich danych przez agenta
        if (user.role === Role.AGENT_) {
          setAgentId(user.id)
        }

        const isPermit: boolean = user.role === Role.ADMIN_ || user.role === Role.COACH_;
        setIsPermit(isPermit);

      } catch (error) {
        toast.error('Błąd pobierania użytkowników', { position: toast.POSITION.TOP_RIGHT, theme: "dark" })
        console.log('Błąd pobierania użytkowników', error);
      }
    }
    fetchData();
  }, []);

// ====== Funkcje =====================================================================================================================================================================================================================
  async function getAgentDachboard() {

    if (dateAgent !== '' && agentId > 0) {

      const findUser = userList.find(user => user.id === agentId)
      if (findUser !== undefined) {
        setAgentName(findUser.nameUser)
      }

      if (findUser !== undefined) {
        const finalScorePeriod = await getFinalScoreData(dateAgent, findUser, 3); // Pobranie wszystkich danych ( 3 miesiące )
        const finalScore = await getFinalScoreData(dateAgent, findUser, 0); // Pobranie obecnego miesiąca (Można odfiltrować zamiast pobierać 2x dane)
        setFinalPeriod(finalScorePeriod);
        setFinal(finalScore);

      }
    } else {
      toast.error("Uzupełnij poprawnie datę i wybierz agenta", {position: toast.POSITION.TOP_RIGHT, theme: "dark"});
    }

  }

  function getNoteCCRates(noteList: NoteCC[]): number[] { // Funkcja, która pobiera oceny z obiektów NoteCC i zwraca listę ocen
    return noteList.map(note => getNoteCC_Rate(note) * 100);
  }
// ====== HTML =====================================================================================================================================================================================================================
  return (
    <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
      <ToastContainer />
      <div className='flex items-center justify-center'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-info w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>

        <h1 className='text-info text-3xl text-center ml-3'> Dashboard</h1>
      </div>
      <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>
      {/* Nagłówek pobierania danych */}
      <div className='flex sm:flex-col lg:flex-row justify-center mt-1'>

        <div className='flex sm:flex-col lg:flex-row mt-5 items-center justify-center'>

          <div className="flex flex-col mr-2 ml-4">
            <span className="label-text">Data:<span className="label-text text-red-600">*</span></span>
            <input
              className="input input-bordered w-full max-w-xs"
              value={dateAgent}
              onChange={e => { setDateAgent(e.currentTarget.value) }}
              type="month"
              placeholder="Type here"
            />
          </div>

          <div className="flex flex-col mr-2">
            <span className="label-text">Agent:</span>
            <select
              className="select select-info w-72"
              disabled={!isPermit}
              value={agentId}
              onChange={e => {
                setAgentId(parseInt(e.target.value))
              }}>
              <option value={0} disabled>Wybierz agenta ...</option>
              {userList.filter(user => user.role === Role.AGENT_).map((user) => (
                <option key={user.id} value={user.id}>{user.nameUser}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end sm:mt-3 ">
            <button onClick={getAgentDachboard} className="btn btn-outline btn-info mx-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Pobierz dane
            </button>
          </div>
        </div>
      </div>

      {/* Kafelki z ocenami */}
      <hr className="w-full h-1 opacity-50 border-0 rounded bg-info my-4"></hr>
      <div className={`flex sm:flex-col lg:flex-row justify-center mt-1 ${final.noteList.length === 0 ? 'hidden' : ''}`}>

        <div className="stats shadow">

          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>

            </div>
            <div className="stat-title">Coachingi</div>
            <div className="stat-value text-primary">{Math.round(getFinalScore(final) * 100) + " %"}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
              </svg>
            </div>
            <div className="stat-title">Rozmowy i maile</div>
            <div className="stat-value text-secondary">{Math.round(getFinalScoreRateCCAndRateM(final) * 100) + " %"}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
              </svg>
            </div>
            <div className="stat-title">Tajemniczy / Bieżący</div>
            <div className="stat-value text-info">{Math.round(getFinalScoreMysteryAndCurrent(final) * 100) + " %"}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </div>
            <div className="stat-title">Testy</div>
            <div className="stat-value text-warning">{Math.round(getFinalScoreTests(final) * 100) + " %"}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
              </svg>
            </div>
            <div className="stat-title">Skargi / Pochwały</div>
            <div className="stat-value text-accent">{Math.round(getFinalScoreFeedback(final) * 100) + " %"}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>

      {/* Ocena i wykres główny */}
      <div className='flex'>
        <div className={`flex flex-row m-5 ${final.noteList.length === 0 ? 'hidden' : ''}`}>
          {final.noteList.length !== 0 && <Dashboard_DoughnutChart value={getFinalScore(final) * 100} agentName={agentName} />}
        </div>
        <div className={`flex flex-row m-5 ${final.noteList.length === 0 ? 'hidden' : ''}`}>
          {final.noteList.length !== 0 && <Dashboard_LineChart value={getNoteCCRates(finalPeriod.noteList)} agentName={agentName} />}
        </div>

      </div>
    </div >
  )
}
export default Dashboard;