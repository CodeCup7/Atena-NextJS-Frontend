'use client'
import { uploadTestsFromExcel } from '@/app/factory/factory_test';
import { useState } from 'react';
import readXlsxFile from 'read-excel-file';

export default function UploadExcel() {
    const [data, setData] = useState<string[][]>([]); // Ustawienie typu danych jako string[][]

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Zabezpieczenie przed możliwością null

        if (file) {
            readXlsxFile(file).then((rows) => {
                setData(rows as string[][]); // Rzutowanie typu rows na string[][]
                uploadTestsFromExcel(data)
            }).catch((error) => {
                console.error('Wystąpił błąd podczas wczytywania pliku Excel:', error);
            });
        }
    };

    return (
        <div>
            <h1>Wczytaj plik Excel</h1>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            {data.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            {data[0].map((cell, index) => (
                                <th key={index}>Kolumna {index + 1}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
