'use client';

import { USER_INFO } from 'constants/userinfoset';
import DropDown from '../profile/DropDown';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  mypageMyInfoState,
  mypageMyProfileImgState,
  mypagePatchSuccessState,
} from 'recoil/mypage';
import { useEffect, useState } from 'react';
import Button from 'components/common/Button';
import { EditPen } from 'ui/EditPen';
import { MY_PAGE } from 'constants/mypage';
import { useRouter } from 'next/navigation';

interface EditUserInfoContainerProps {
  userId: number;
}

const fetchData = async (nickName: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_SERVER}/api/user/checkNickname?nickName=${nickName}`,
      {
        method: 'POST',
        cache: 'no-store',
      },
    ).then((res) => res.json());

    return response;
  } catch (error) {
    console.error('Error during Fetch Data:', error);
    return error;
  }
};

const EditUserInfoContainer = ({ userId }: EditUserInfoContainerProps) => {
  const [mypageMyInfo, setMypageMyInfo] = useRecoilState(mypageMyInfoState);
  const [successNickname, setSuccessNickname] = useState(0);
  const [isGradeOpen, setIsGradeOpen] = useState<boolean>(false);
  const [isMajorOpen, setIsMajorOpen] = useState<boolean>(false);
  const [isDoubleMajorOpen, setIsDoubleMajorOpen] = useState<boolean>(false);
  const [isInterestFieldOpen, setIsInterestFieldOpen] =
    useState<boolean>(false);
  const [isEditingNickname, setIsEditingNickname] = useState<boolean>(false);
  const [isEditingLink, setIsEditingLink] = useState<boolean>(false);
  const [isEditingIntro, setIsEditingIntro] = useState<boolean>(false);
  const [newLink, setNewLink] = useState<string>(
    mypageMyInfo.request.links.join('\n'),
  );
  const [newIntro, setNewIntro] = useState<string>(
    mypageMyInfo.request.selfIntro,
  );
  const profileFile = useRecoilValue(mypageMyProfileImgState);
  const setPatchSuccess = useSetRecoilState(mypagePatchSuccessState);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isEditTextArea = (event.target as HTMLElement).closest('textarea');
      if (!isEditTextArea) {
        setIsEditingLink(false);
        setIsEditingIntro(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  useEffect(() => {
    setNewLink(mypageMyInfo.request.links.join('\n'));
    setNewIntro(mypageMyInfo.request.selfIntro);
  }, [mypageMyInfo]);

  useEffect(() => {
    const linksArray = newLink.split('\n');
    setMypageMyInfo((prev) => ({
      ...prev,
      request: {
        ...prev.request,
        links: linksArray,
      },
    }));
  }, [newLink]);

  useEffect(() => {
    setMypageMyInfo((prev) => ({
      ...prev,
      request: {
        ...prev.request,
        selfIntro: newIntro,
      },
    }));
  }, [newIntro]);

  const handleDataPatch = async () => {
    try {
      const formData = new FormData();
      if (profileFile) {
        formData.append('profileImage', profileFile, profileFile.name);
      }
      formData.append(
        'request',
        new Blob([JSON.stringify(mypageMyInfo.request)], {
          type: 'application/json',
        }),
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_SERVER}/api/user/edit`,
        {
          method: 'PATCH',
          body: formData,
        },
      );
      if (response.status === 200) {
        setPatchSuccess({ isSuccess: 1, message: MY_PAGE.SUCCESS_MODIFY });
        setTimeout(() => {
          setPatchSuccess({ isSuccess: 0, message: '' });
          router.push(`/mypage/${userId}`);
        }, 2000);
      } else {
        setPatchSuccess({ isSuccess: 2, message: MY_PAGE.FAIL_MODIFY });
        setTimeout(() => {
          setPatchSuccess({ isSuccess: 0, message: '' });
        }, 2000);
      }
    } catch (error) {
      console.error('Error during Fetch Data:', error);
    }
  };

  const handleEditingValue = (type: string) => {
    switch (type) {
      case 'nickname':
        setIsEditingNickname(true);
        break;
      case 'link':
        setIsEditingLink(true);
        break;
      case 'intro':
        setIsEditingIntro(true);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const newLinkList = newLink.split('\n').length;
      if (newLinkList >= 3 && e.key === 'Enter') {
        e.preventDefault();
      }
    }
  };

  const handleTextarea = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    type: string,
  ) => {
    const userInput = e.target.value;

    const applyCharacterLimitPerLine = (text: string, limit: number) => {
      const lines = text.split('\n');
      const limitedLines = lines.map((line) => line.slice(0, limit));
      return limitedLines.join('\n');
    };

    switch (type) {
      case 'link':
        if (userInput.length > 100) {
          const limitedText = applyCharacterLimitPerLine(userInput, 100);
          setNewLink(limitedText);
        } else {
          setNewLink(userInput);
        }
        break;
      case 'intro':
        if (userInput.length > 500) {
          setNewIntro(userInput.slice(0, 500));
        } else {
          setNewIntro(userInput);
        }
        break;
    }
  };

  const handleItemSelect = (type: string) => (item: string) => {
    handleIsOpen(type);
    setMypageMyInfo((prev) => ({
      ...prev,
      request: {
        ...prev.request,
        userGrade:
          type === 'grade' ? parseInt(item[0]) : prev.request.userGrade,
        major: type === 'major' ? item : prev.request.major,
        doubleMajor: type === 'doubleMajor' ? item : prev.request.doubleMajor,
        interestField:
          type === 'interestField' ? item : prev.request.interestField,
      },
    }));
  };

  const handleIsOpen = (type: string) => {
    switch (type) {
      case 'grade':
        setIsGradeOpen((prev) => !prev);
        setIsMajorOpen(false);
        setIsDoubleMajorOpen(false);
        setIsInterestFieldOpen(false);
        break;
      case 'major':
        setIsGradeOpen(false);
        setIsMajorOpen((prev) => !prev);
        setIsDoubleMajorOpen(false);
        setIsInterestFieldOpen(false);
        break;
      case 'doubleMajor':
        setIsGradeOpen(false);
        setIsMajorOpen(false);
        setIsDoubleMajorOpen((prev) => !prev);
        setIsInterestFieldOpen(false);
        break;
      case 'interestField':
        setIsGradeOpen(false);
        setIsMajorOpen(false);
        setIsDoubleMajorOpen(false);
        setIsInterestFieldOpen((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const handleNickname = async () => {
    const response = await fetchData(mypageMyInfo.request.nickname);
    if (response === false) {
      setMypageMyInfo((prev) => ({ ...prev, successNickname: true }));
      setSuccessNickname(1);
    } else {
      setMypageMyInfo((prev) => ({ ...prev, successNickname: false }));
      setSuccessNickname(2);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative my-32">
      <div className="w-[320px] h-full flex flex-col items-center">
        <div className="flex flex-col w-[320px] items-end">
          <div className="flex justify-between w-[320px]">
            <label className="w-full relative flex items-center">
              <input
                className={`${
                  isEditingNickname ? 'w-[239px] pr-4' : 'w-full pr-12'
                } h-[38px] rounded-[8px] focus:outline-none border ${
                  successNickname === 1
                    ? 'border-[#517EF3]'
                    : successNickname === 2
                      ? 'border-[#FF7272]'
                      : 'border-[#8C8C8C]'
                } text-white text-xs bg-black font-semibold text-right`}
                type="text"
                readOnly={!isEditingNickname}
                value={mypageMyInfo.request.nickname || ''}
                placeholder={mypageMyInfo.request.nickname || ''}
                onChange={(e) => {
                  const userInput = e.target.value;
                  const filteredInput = userInput.replace(
                    /[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/g,
                    '',
                  );
                  const trimmedInput = filteredInput.slice(0, 16);
                  setMypageMyInfo((prev) => ({
                    ...prev,
                    request: {
                      ...prev.request,
                      nickname: trimmedInput,
                    },
                  }));
                }}
              />
              <span className="absolute px-4 text-[#D9D9D9] text-xs font-semibold w-full flex justify-between">
                {USER_INFO.NICKNAME}
                {!isEditingNickname && (
                  <div
                    className="w-[17px] h-[17px]"
                    onClick={() => handleEditingValue('nickname')}
                  >
                    <EditPen />
                  </div>
                )}
              </span>
            </label>
            {isEditingNickname && (
              <Button
                buttonText={USER_INFO.NICKNAME_BTN}
                type="userinfo"
                className={`w-[68px] h-[38px] ${
                  mypageMyInfo.request.nickname.length === 0
                    ? 'bg-zinc-300 text-black'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                } rounded-[8px] justify-center items-center flex text-[10px] font-normal`}
                isDisabled={mypageMyInfo.request.nickname.length === 0}
                onClickHandler={handleNickname}
              />
            )}
          </div>
          {successNickname === 1 ? (
            <div className="right-1 top-8 mt-3 text-[#517EF3] text-[10px] font-normal">
              {USER_INFO.NICKNAME_SUCCESS}
            </div>
          ) : successNickname === 2 ? (
            <div className="right-1 top-8 mt-3 text-[#FF7272] text-[10px] font-normal">
              {USER_INFO.NICKNAME_FAIL}
            </div>
          ) : null}
        </div>
        <DropDown
          title="학년"
          type="edit"
          sortedItemList={[...USER_INFO.GRADE_LIST]}
          selectedItem={
            mypageMyInfo.request.userGrade === 0
              ? '-'
              : `${mypageMyInfo.request.userGrade}학년`
          }
          onItemSelect={handleItemSelect('grade')}
          onOpen={() => handleIsOpen('grade')}
          isOpen={isGradeOpen}
          className={`mt-4 w-[320px] max-h-[300px]`}
          buttonClassName={`relative w-[320px] h-[38px] rounded-[8px] border border-[#8C8C8C] ${
            mypageMyInfo.request.userGrade !== 0
              ? 'text-white'
              : 'text-[#D9D9D9]'
          } text-xs font-semibold text-left flex justify-end gap-5 items-center px-4`}
          dropDownClassName={`z-30 absolute w-[320px] max-h-[210px] rounded-[9px] bg-[#3A3A3A] overflow-y-scroll scrollbar-hide`}
          itemClassName={`w-[300px] h-[34px] py-2 pl-2 text-xs font-normal hover:text-white`}
        />
        <DropDown
          title="본전공"
          type="edit"
          sortedItemList={[...USER_INFO.MAJOR_LIST].sort()}
          selectedItem={
            mypageMyInfo.request.major.length === 0
              ? '-'
              : mypageMyInfo.request.major
          }
          onItemSelect={handleItemSelect('major')}
          onOpen={() => handleIsOpen('major')}
          isOpen={isMajorOpen}
          className={`mt-4 w-[320px] max-h-[300px]`}
          buttonClassName={`relative w-[320px] h-[38px] rounded-[8px] border border-[#8C8C8C] ${
            mypageMyInfo.request.major !== '' ? 'text-white' : 'text-[#D9D9D9]'
          } text-xs font-semibold text-left flex justify-end gap-5 items-center px-4`}
          dropDownClassName={`z-30 absolute w-[320px] max-h-[210px] rounded-[9px] bg-[#3A3A3A] overflow-y-scroll scrollbar-hide`}
          itemClassName={`w-[300px] h-[34px] py-2 pl-2 text-xs font-normal hover:text-white`}
        />
        <DropDown
          title="복/부전공"
          type="edit"
          sortedItemList={[...USER_INFO.DOUBLE_MAJOR_LIST].sort()}
          selectedItem={
            mypageMyInfo.request.doubleMajor.length === 0
              ? '-'
              : mypageMyInfo.request.doubleMajor
          }
          onItemSelect={handleItemSelect('doubleMajor')}
          onOpen={() => handleIsOpen('doubleMajor')}
          isOpen={isDoubleMajorOpen}
          className={`mt-4 w-[320px] max-h-[300px]`}
          buttonClassName={`relative w-[320px] h-[38px] rounded-[8px] border border-[#8C8C8C] ${
            mypageMyInfo.request.doubleMajor !== ''
              ? 'text-white'
              : 'text-[#D9D9D9]'
          } text-xs font-semibold text-left flex justify-end gap-5 items-center px-4`}
          dropDownClassName={`z-30 absolute w-[320px] max-h-[210px] rounded-[9px] bg-[#3A3A3A] overflow-y-scroll scrollbar-hide`}
          itemClassName={`w-[300px] h-[34px] py-2 pl-2 text-xs font-normal hover:text-white`}
        />
        <DropDown
          title="관심분야"
          type="edit"
          sortedItemList={[...USER_INFO.INTEREST_FIELD_LIST]}
          selectedItem={
            mypageMyInfo.request.interestField === ''
              ? '-'
              : mypageMyInfo.request.interestField
          }
          onItemSelect={handleItemSelect('interestField')}
          onOpen={() => handleIsOpen('interestField')}
          isOpen={isInterestFieldOpen}
          className={`mt-4 w-[320px] max-h-[300px]`}
          buttonClassName={`relative w-[320px] h-[38px] rounded-[8px] border border-[#8C8C8C] ${
            mypageMyInfo.request.interestField !== ''
              ? 'text-white'
              : 'text-[#D9D9D9]'
          } text-xs font-semibold text-left flex justify-end gap-5 items-center px-4`}
          dropDownClassName={`z-30 absolute w-[320px] max-h-[210px] rounded-[9px] bg-[#3A3A3A] overflow-y-scroll scrollbar-hide`}
          itemClassName={`w-[300px] h-[34px] py-2 pl-2 text-xs font-normal hover:text-white`}
        />
        <div
          className={`w-full h-[38px] flex justify-between px-4 relative items-center mt-4 rounded-[8px] border border-[#8C8C8C]`}
        >
          <span className=" text-[#D9D9D9] text-xs font-semibold">
            {MY_PAGE.EMAIL}
          </span>
          <span className="text-[#D9D9D9] w-[200px] flex justify-end text-xs font-semibold">
            {mypageMyInfo.request.email ? mypageMyInfo.request.email : '-'}
          </span>
        </div>
        <div
          className={`w-full relative justify-between flex items-center mt-4 py-3 rounded-[8px] border border-[#8C8C8C]`}
        >
          <span className="relative mx-4 w-[10%] text-[#D9D9D9] text-xs font-semibold flex">
            {MY_PAGE.LINK}
          </span>
          <textarea
            className={`relative w-[60%] pr-4 rounded-[8px] focus:outline-none scrollbar-hide text-white text-xs bg-black font-semibold `}
            readOnly={!isEditingLink}
            value={newLink || ''}
            rows={3}
            onChange={(e) => handleTextarea(e, 'link')}
            onKeyDown={handleKeyDown}
          />
          {isEditingLink ? (
            <div className="relative w-[30px] h-[30px] mr-3 items-center justify-center flex cursor-pointer"></div>
          ) : (
            <div
              className="relative w-[30px] h-[30px] mr-3 items-center justify-center flex cursor-pointer"
              onClick={() => handleEditingValue('link')}
            >
              <EditPen />
            </div>
          )}
        </div>
        <div
          className={`w-full relative justify-between flex items-center mt-4 py-3 rounded-[8px] border border-[#8C8C8C]`}
        >
          <div className="relative mx-4 w-[10%] text-[#D9D9D9] text-xs font-semibold flex ">
            {MY_PAGE.INTRODUCE}
          </div>
          <textarea
            className={`relative w-[60%] pr-4 rounded-[8px] focus:outline-none scrollbar-hide text-white text-xs bg-black font-semibold `}
            readOnly={!isEditingIntro}
            value={newIntro || ''}
            rows={3}
            onChange={(e) => handleTextarea(e, 'intro')}
          />
          {isEditingIntro ? (
            <div className="relative w-[30px] h-[30px] mr-3 items-center justify-center flex cursor-pointer"></div>
          ) : (
            <div
              className="relative w-[30px] h-[30px] mr-3 items-center justify-center flex cursor-pointer"
              onClick={() => handleEditingValue('intro')}
            >
              <EditPen />
            </div>
          )}
        </div>

        <Button
          buttonText={MY_PAGE.MODIFY_PROFILE}
          type="userinfo"
          className="mt-10 w-full bg-[#3A3A3A] text-white text-xs font-semibold rounded-[8px] h-[38px] justify-center items-center flex hover:bg-gradient-to-r from-[#00E0EE] to-[#517EF3]"
          isDisabled={false}
          onClickHandler={() => handleDataPatch()}
        />
      </div>
    </div>
  );
};

export default EditUserInfoContainer;
