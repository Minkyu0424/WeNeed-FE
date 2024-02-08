'use client';
import Icons from 'components/common/Icons';
import { miniFileIconPath_P, selectFileIcon } from 'ui/IconsPath';
import MiniFileTypeContainer from '../both/containers/MiniFileTypeContainer';
import { FILE_TYPE_LIST } from 'constants/portfolio';
import { useModal } from 'hooks/upload/useModal';

const SelectFileP = () => {
  const { isOpen, openModal, closeModal, handleModalClick } = useModal(false);

  return (
    <div>
      <div
        onClick={openModal}
        className="flex items-center justify-center w-[1200px] h-[66px] gap-x-[10px] cursor-pointer border border-dashed border-neutral-400"
      >
        <Icons name={selectFileIcon} />
        <div onClick={handleModalClick}>
          <p className="text-lg font-bold text-black">미디어 추가하기</p>
          {isOpen && (
            <MiniFileTypeContainer
              fileTypeList={FILE_TYPE_LIST}
              fileIconPath={miniFileIconPath_P}
              closeModal={closeModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectFileP;
