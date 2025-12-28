
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';

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
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
        />
        
        {/* Modal Container */}
        <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none text-center">
          <motion.div
            layoutId="modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            // Mobile дээр доош нь чирэхэд хаагдах функц
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="pointer-events-auto w-full sm:max-w-[360px] bg-white rounded-t-[2rem] sm:rounded-[2.5rem] p-6 pb-10 sm:p-8 shadow-2xl relative"
          >
            {/* Handlebar - Чирэх хэсэг */}
            <div className="w-10 h-1 bg-gray-100 rounded-full mx-auto mb-6 sm:hidden" />

            <div className="flex flex-col items-center">
              {/* Icon - Илүү компакт */}
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5 text-red-500 shadow-inner">
                <Trash2 size={32} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                Устгах уу?
              </h3>
              
              <p className="text-[10px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8 px-4">
                "<span className="text-red-500">{title}</span>" <br/>
                бичлэг бүрмөсөн устахыг анхаарна уу.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-3">
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="order-1 sm:order-2 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-red-200 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isDeleting ? 'Устгаж байна...' : 'Устгах'}
                </button>
                
                <button
                  onClick={onClose}
                  className="order-2 sm:order-1 py-3.5 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all"
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