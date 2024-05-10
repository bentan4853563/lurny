import PropTypes from "prop-types";

const ConfirmModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-neutral-800/50 flex">
      <div className="w-[150rem] sm:w-[48rem] relative p-[10rem] sm:p-[4rem] bg-white shadow-md shadow-gray-400 m-auto flex-col flex rounded-lg gap-[4rem] sm:gap-[2rem]">
        <div>
          <h1 className="text-[10rem] sm:text-[3rem] font-bold">{title}</h1>
          <p className="py-4 text-[6rem] sm:text-[1.5rem] font-extrabold">
            {message}
          </p>
        </div>
        <div className="flex justify-end gap-8">
          <button
            onClick={onClose}
            className="bg-transparent hover:bg-gray-100 text-gray-700 text-[6rem] sm:text-[2rem] font-semibold py-[1.5rem] sm:py-0 px-[4rem] sm:px-[1rem] border border-gray-400 rounded shadow focus:outline-sky-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 hover:bg-blue-700 text-white text-[6rem] sm:text-[2rem] font-bold py-[1.5rem] sm:py-0 px-[4rem] sm:px-[1rem] rounded focus:outline-sky-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default ConfirmModal;
