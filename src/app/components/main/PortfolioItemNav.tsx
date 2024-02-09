import Icons from 'components/common/Icons';
import { SORT_TYPES } from 'constants/main';
import { drop } from 'ui/IconsPath';

const PortfolioItemNav = () => {
  return (
    <div className="relative w-full border-b border-white pb-[15px] mb-[40px]">
      <div className="w-24 h-5 flex items-center gap-[10px] cursor-pointer">
        <Icons name={drop} />
        <div className="text-white text-base font-semibold ">
          {SORT_TYPES.default}
        </div>
      </div>
      <div className="absolute top-[34px] z-20 bg-black w-[247px] h-[147px] border border-white rounded-b-2xl"></div>
    </div>
  );
};

export default PortfolioItemNav;
