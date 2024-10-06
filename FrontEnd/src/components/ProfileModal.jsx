import React, { useState } from "react";
import Modal from 'react-modal';

const ProfileModal = ({ isOpen, onClose,donor}) => {
  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="fixed inset-0 flex items-center justify-center p-4 bg-gray-600 bg-opacity-50 z-50"
    >
     <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">{donor}</h2>
     </div>
    </Modal>
  )
}

export default ProfileModal
