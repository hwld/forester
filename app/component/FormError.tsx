import { MdError } from "react-icons/md";

type Props = { message: string };

export const FormError: React.VFC<Props> = ({ message }) => {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
      <MdError className="fill-red-500 w-5 h-5" />
      <p className="text-red-600">{message}</p>
    </div>
  );
};
