import Icons from 'components/common/Icons';
import Image from 'next/image';
import Profile from '../../common/Profile';
import DetailContents from '../DetailContents';
import DetailMenuBar from '../DetailMenuBar';
import WriterOptions from '../WriterOptions';
import Link from 'next/link';
import DetailContentsInfo from 'components/details/common/DetailContentsInfo';
import GradientProfile from 'ui/gradient/GradientProfile';
import { bigWeneed } from 'ui/IconsPath';
import Counts from 'components/details/common/Counts';
import { useRef } from 'react';

interface PortfolioDetailsContainerProps {
  user: UserProfile;
  portfolio: PortfolioDetails;
  articleId: string;
  isPreview?: boolean;
}

const PortfolioDetailsContainer = ({
  user,
  portfolio,
  articleId,
  isPreview,
}: PortfolioDetailsContainerProps) => {
  const {
    thumbnail,
    writer,
    createdAt,
    viewCount,
    heartCount,
    bookmarkCount,
    tags,
    title,
    contents,
    teamMembers,
    files,
    skills,
  } = portfolio;
  const { bookmarked, hearted } = user;
  const commentsRef = useRef<HTMLDivElement>(null);

  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <article
      className={`flex flex-col items-center bg-black text-white min-h-screen w-full ${
        isPreview ? 'pointer-events-none' : ''
      }`}
    >
      {thumbnail ? (
        <div className="relative flex justify-center items-center w-screen h-[380px] overflow-hidden min-w-[1000px]">
          <Image
            priority
            src={thumbnail}
            width={0}
            height={0}
            sizes="100vw"
            alt="thumbnail"
            style={{
              objectFit: 'cover',
              width: '100vw',
              height: '380px',
            }}
            quality={50}
          />
        </div>
      ) : (
        <div className="relative w-full h-96 bg-gradient-to-r from-[#4EF4FF] to-[#608CFF]">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Icons name={bigWeneed} />
          </div>
        </div>
      )}
      <div className="w-full mb-[143px]">
        <div className="relative mb-[60px] mt-[48px]">
          <div className="absolute top-0 left-[-96px] flex ">
            {teamMembers?.map((mem, i) => (
              <Link href={`/mypage/${mem.userId}`} key={mem.userId}>
                <div
                  className="rounded-full overflow-hidden w-[80px] h-[80px]"
                  style={{
                    marginLeft: `${
                      teamMembers.length == 1 ? `50px` : `-${i * 30}px`
                    }`,
                  }}
                >
                  {mem.profile ? (
                    <div className="relative rounded-full overflow-hidden w-[80px] h-[80px]">
                      <Image
                        fill={true}
                        alt="writer"
                        src={mem.profile}
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ) : (
                    <GradientProfile />
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Link href={`/mypage/${writer.userId}`}>
            <Profile
              writer={writer}
              date={createdAt}
              user={{ bookmarked, hearted }}
              size="large"
            />
          </Link>
        </div>
        <DetailContentsInfo tags={tags} createdAt={createdAt} />
        <DetailContents
          title={title}
          contents={contents}
          files={files}
          skills={skills}
        />
        <div className="w-full flex justify-center mt-[100px]">
          <Counts count={[viewCount, heartCount, bookmarkCount]} gradient />
        </div>
        <DetailMenuBar
          userId={writer.userId || -1}
          user={user}
          articleId={articleId}
          page="portfolio"
          recruiting={false}
          hasApplied={false}
          scrollToComments={scrollToComments}
        />
        {user.sameUser && (
          <WriterOptions
            articleId={articleId}
            userId={writer.userId || -1}
            nickname={writer.writerNickname || ''}
          />
        )}
      </div>
      <div ref={commentsRef}></div>
    </article>
  );
};

export default PortfolioDetailsContainer;
