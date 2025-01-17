'use client';

import { MY_PAGE } from 'constants/mypage';
import InfoBox from '../profile/InfoBox';
import Button from 'components/common/Button';
import { useRouter } from 'next/navigation';

interface InfoBoxContainerProps {
  doubleMajor: string;
  interestField: string;
  email: string;
  links: string[];
  selfIntro: string;
  sameUser: boolean;
  userId: number;
}

export const InfoBoxContainer = ({
  doubleMajor,
  interestField,
  email,
  links,
  selfIntro,
  sameUser,
  userId,
}: InfoBoxContainerProps) => {
  const router = useRouter();
  const itemList = [doubleMajor, interestField, email, links, selfIntro];

  const handleLogout = () => {
    const cookies = document.cookie.split(';');
    cookies.forEach((cookie) => {
      const cookieParts = cookie.split('=');
      const cookieName = cookieParts[0].trim();
      document.cookie = `${cookieName}=; expires=0; path=/;`;
    });
    router.push('/');
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {MY_PAGE.ITEM_LIST.map((item: string, index: number) => (
        <InfoBox
          type={index === 4 ? 'explanation' : index === 3 ? 'links' : 'default'}
          key={item}
          title={item}
          content={itemList[index]}
        />
      ))}
      {sameUser && (
        <>
          <Button
            buttonText={MY_PAGE.MODIFY_PROFILE}
            type="userinfo"
            className={`w-[300px] h-[40px] text-zinc-300 text-xs font-semibold relative rounded-[10px] bg-neutral-700 justify-center items-center flex px-8 hover:bg-gradient-to-r from-[#00E0EE] to-[#517EF3] hover:opacity-100`}
            isDisabled={false}
            onClickHandler={() => router.push(`/edit/${userId}`)}
          />
          <Button
            buttonText={MY_PAGE.LOG_OUT}
            type="userinfo"
            className={`w-[300px] h-[40px] mb-12 text-zinc-300 text-xs font-semibold relative rounded-[10px] bg-neutral-700 justify-center items-center flex px-8 hover:bg-gradient-to-r from-[#00E0EE] to-[#517EF3] hover:opacity-100`}
            isDisabled={false}
            onClickHandler={() => handleLogout()}
          />
        </>
      )}
    </div>
  );
};
