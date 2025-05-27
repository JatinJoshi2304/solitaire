import { Link, useLocation } from "react-router-dom";

const ChooseGameModal = ({ closeModal }: any) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const handleClose = () => closeModal(false);
  console.log("current route :: ", currentPath);

  return (
    <>
      <div
        tabIndex={-1}
        className="fixed inset-0 z-500 flex justify-center items-center bg-opacity-50"
        onClick={handleClose}
      >
        <div className="relative top-12 p-4 w-140 z-0">
          <div
            className="relative flex flex-row-reverse w-128 h-96 bg-white border border-gray-300 rounded-md "
            onClick={(e) => e.stopPropagation()} // this stop the click event from bubbling up to parent div
          >
            <span className="absolute z-0 top-44 left-20 text-2xl font-semibold">
              <Link
                to="/allinarena"
                className="border-1 rounded-sm px-2 cursor-pointer"
                onClick={() => {
                  debugger;
                  if (currentPath === "/allinarena") handleClose();
                }}
              >
                New
              </Link>
            </span>
            <span className="absolute top-44 right-30 text-2xl font-semibold">
              <Link
                to="/canfieldsolitaire"
                className="border-1 rounded-sm px-2  cursor-pointer"
                onClick={() => {
                  debugger;
                  if (currentPath === "/canfieldsolitaire") handleClose();
                }}
              >
                Old
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseGameModal;
