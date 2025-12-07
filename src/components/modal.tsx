"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background Blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {/* Panel */}
              <Dialog.Panel
                className="
                  relative
                  w-full
                  max-w-3xl     /* << BIGGER SIZE */
                  transform
                  overflow-hidden
                  rounded-lg
                  bg-[#445566]
                  p-0
                  text-left
                  shadow-xl
                  transition-all
                "
              >
                {/* Top bar */}
                <div
                  className="
                    flex
                    justify-between
                    items-center
                    px-6
                    py-4
                    border-b
                    border-[#324354]
                  "
                >
                  <h1 className="text-lg font-semibold text-white">
                    I watched…
                  </h1>

                  <button
                    type="button"
                    onClick={onClose}
                    className="
                      rounded-md 
                      p-1
                      hover:bg-white/10
                      transition
                    "
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
