import React, { useState, useContext, createContext } from 'react';

const ModalContext = createContext({});

export const ModalProvider = ({ children }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content: any) => {
    setIsModalOpen(true);
    setModalContent(content);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, modalContent, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useSignInModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
