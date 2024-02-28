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
import { IconCurrent, IconDashboard, IconDownload, IconFeedback, IconMystery, IconNoteCC, IconPreview, IconRateCC, IconTest } from '../../components/icons/icons';

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
      toast.error("Uzupełnij poprawnie datę i wybierz agenta", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
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
        <IconDashboard className='text-info' size={12} />

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
              <IconDownload />
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
              <IconNoteCC size={12} />

            </div>
            <div className="stat-title">Coachingi</div>
            <div className="stat-value text-primary">{Math.round(getFinalScore(final) * 100) + " %"}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IconRateCC size={12} />
            </div>
            <div className="stat-title">Rozmowy i maile</div>
            <div className="stat-value text-secondary">{Math.round(getFinalScoreRateCCAndRateM(final) * 100) + " %"}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-info">
              <IconCurrent size={12} />
            </div>
            <div className="stat-title">Tajemniczy / Bieżący</div>
            <div className="stat-value text-info">{Math.round(getFinalScoreMysteryAndCurrent(final) * 100) + " %"}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-warning">
              <IconTest size={12} />
            </div>
            <div className="stat-title">Testy</div>
            <div className="stat-value text-warning">{Math.round(getFinalScoreTests(final) * 100) + " %"}</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-accent">
              <IconFeedback size={12} />
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