type Props = {
  text: string;
  isSubmitting?: boolean;
};

export const AuthSubmitButton: React.VFC<Props> = ({ text, isSubmitting }) => {
  return (
    <button
      type="submit"
      className="py-2 px-3 w-full bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 
        focus:ring-offset-2 hover:bg-emerald-600 rounded-md text-white font-bold text-center transition-shadow disabled:bg-emerald-700"
    >
      {isSubmitting ? "送信中..." : text}
    </button>
  );
};
