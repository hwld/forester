import { useNavigate } from "@remix-run/react";
import { MdOutlineArrowBack } from "react-icons/md";

type Props = { title: string; canBack?: boolean };
export const MainHeader: React.VFC<Props> = ({ title, canBack = false }) => {
  const navigator = useNavigate();

  const handleClickReturn = () => {
    navigator(-1);
  };

  return (
    <div className="sticky top-0 h-12 bg-emerald-600 flex items-center px-4 select-none z-10 space-x-2">
      {canBack && (
        <button
          onClick={handleClickReturn}
          className="rounded-full flex items-center justify-center group"
        >
          <MdOutlineArrowBack className="fill-white w-8 h-8" />
          <div className="w-11 h-11 absolute bg-transparent rounded-full group-hover:bg-white/20 transition"></div>
        </button>
      )}
      <p className="font-bold text-xl text-white">{title}</p>
    </div>
  );
};
