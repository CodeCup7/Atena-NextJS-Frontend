'use client'
import { RateM } from "@/app/classes/rateM";
import { CreateNewEmptyRateM } from "@/app/factory/factory_rateM";
import { useState } from "react";

export const Test = () => {
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setAttachment(event.target.files[0]);
    }
  };

  const handleSendClick = () => {
    // Dodaj warunek, aby sprawdzić, czy załącznik istnieje, zanim wywołasz uploadFile
    if (attachment !== null) {
      uploadFile();
    }
  };

  const uploadFile = async () => {

    const rateM:RateM = new RateM();
    rateM.coach.id = 2;
    rateM.agent.id = 10;


    if (attachment !== null) {
      const formData = new FormData();
      formData.append('rateM', JSON.stringify(rateM));
      formData.append('file', attachment);

      console.log(formData)

      try {
        const response = await fetch('http://localhost:8080/api/rateM/add', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          // Obsłuż poprawną odpowiedź z serwera
          console.log('Plik został pomyślnie przesłany.');
        } else {
          // Obsłuż błędną odpowiedź z serwera
          console.error(response);
        }
      } catch (error) {
        // Obsłuż błędy związane z żądaniem HTTP
        console.error('Błąd HTTP:', error);
      }
    } else {
      console.warn('Nie wybrano pliku do przesłania.');
    }
  };


  return (
    <div>
      <form>
        <input type="file" onChange={handleFileChange} />
      </form>
      {/* Dodaj przycisk do wywołania funkcji uploadFile po kliknięciu */}
      <button onClick={handleSendClick}>Wyślij</button>
    </div>
  );
};

export default Test;
