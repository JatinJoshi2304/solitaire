import Book from "./pageComponent";

const RuleBookComponent = ({ closeModal }: any) => {
  const handleClose = () => closeModal(false);

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
            <span className="absolute top-44 right-30 text-2xl font-semibold">
              End
            </span>
            <Book />
            <span className="absolute z-0 top-44 left-20 text-2xl font-semibold">
              How to Play
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RuleBookComponent;
