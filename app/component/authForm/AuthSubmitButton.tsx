type Props = {
  text: string;
};

export const AuthSubmitButton: React.VFC<Props> = ({ text }) => {
  return (
    <button
      className="py-2 px-3 w-full bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 
        focus:ring-offset-2 hover:bg-emerald-600 rounded-md text-white font-bold"
    >
      {text}
    </button>
  );
};
