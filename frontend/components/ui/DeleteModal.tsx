// DeleteConfirmModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting: boolean;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, isDeleting }: DeleteModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Overlay - Ар талын бүрхүүл */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[100]"
        />
        
        {/* Modal Container */}
        <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          <motion.div
            initial={{ y: "100%", opacity: 0 }} // Мобайл дээр доороос гарч ирнэ
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="pointer-events-auto w-full sm:max-w-[400px] bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 pb-10 sm:pb-8 shadow-2xl"
          >
            {/* Мобайл дээрх жижиг зураас (Handlebar) */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
                <AlertTriangle size={40} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-2 italic">Устгах уу?</h3>
              <p className="text-gray-500 text-base mb-8 leading-relaxed px-4">
                "<span className="font-bold text-gray-800">{title}</span>" бичлэг бүрмөсөн устахыг анхаарна уу.
              </p>

              <div className="flex flex-col sm:flex-row-reverse w-full gap-3">
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-red-100"
                >
                  {isDeleting ? 'Устгаж байна...' : 'Тийм, устга'}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 active:scale-[0.98] transition-all"
                >
                  Болих
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

export default DeleteConfirmModal;