type Props = {};
export const UnfollowButton: React.VFC<Props> = () => {
  return (
    <button className="px-4 pb-[2px] h-9 bg-emerald-500 hover:bg-emerald-600 rounded-3xl font-bold flex items-center">
      フォロー解除
    </button>
  );
};
