import Image from 'next/image';
import GradientProfileMD from 'ui/gradient/GradientProfileMD';

interface UserInfoContainerProps {
  profile: string;
  nickname: string;
  major: string;
  userGrade: number;
}

export const UserInfoContainer = ({
  profile,
  nickname,
  major,
  userGrade,
}: UserInfoContainerProps) => {
  return (
    <div className="relative top-0 flex flex-col justify-center items-center gap-2.5">
      <div className={`rounded-full overflow-hidden w-[57px] h-[57px]`}>
        {profile ? (
          <Image
            src={profile}
            alt="profile"
            width={57}
            height={57}
            style={{
              objectFit: 'cover',
            }}
          />
        ) : (
          <GradientProfileMD />
        )}
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="text-white text-xl font-bold">{nickname}</div>
        <div className="gap-2.5 flex text-stone-300 text-small font-medium">
          {major} | {userGrade}학년
        </div>
      </div>
    </div>
  );
};
