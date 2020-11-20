import React, { createContext, useState } from "react";

interface IModalContext {
  setModalOpen: Function;
}

export const ModalContext = createContext<IModalContext | null>(null);

const ModalContextProvider = (props: any) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const state = {
    setModalOpen: setModalOpen,
  };

  return (
    <ModalContext.Provider value={{ ...state }}>
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-holder">
            <div className="modal">
              Hello!
            </div>
          </div>
        </div>
      )}
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
