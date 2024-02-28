// Komponent ConfirmDialog
import React, { useEffect } from 'react';
import { IconQuestionMark } from '../icons/icons';

interface Prop {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ConfirmDialog: React.FC<Prop> = (props) => {
  useEffect(() => {
    if (props.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [props.open]);

  return (
    <div className={`fixed z-50 top-0 left-0 w-screen h-screen flex items-center justify-center ${props.open ? '' : 'hidden'}`}>

      <div className="bg-black opacity-25 w-full h-full absolute z-10 inset-0"></div>
      <div className="bg-slate-800 border-4 border-slate-400 rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
        <div className="md:flex items-center">
          <IconQuestionMark size={12} />
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <p className="font-bold">{props.title}</p>
            <p className="text-sm text-gray-400 mt-1">{props.content}
            </p>
          </div>
        </div>
        <div className="text-center md:text-right mt-4 md:flex md:justify-end">
          <button
            onClick={() => {
              props.onConfirm();
              props.onClose();
            }}
            className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-green-400 text-black rounded-lg font-semibold text-sm md:ml-2 md:order-2 shadow-2xl hover:bg-green-500 hover:shadow-white hover:drop-shadow-sm">   Potwierdzam   </button>
          <button
            onClick={() => {
              props.onClose();
            }}
            className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-400 text-black rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1 shadow-2xl hover:bg-gray-500 hover:shadow-white hover:drop-shadow-sm"> Anuluj </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
