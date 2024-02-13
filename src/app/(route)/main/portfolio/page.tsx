import Footer from 'components/layout/Footer';
import MainNavbar from 'components/main/common/MainNavbar';
import {
  DetailCategoriesContainer,
  HotItemsContainer,
  PortfolioContainer,
  RecommendContainer,
} from 'components/main/containers';
import { LOGGEDIN_SECTION_HEADINGS, MAIN_SIZE } from 'constants/main';

interface MainPortfolioPageProps {
  params: {
    slug: string[];
  };
}

export default async function MainPortfolioPage({
  params,
}: MainPortfolioPageProps) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NEXT_SERVER}/api/main/portfolio?size=${MAIN_SIZE}&page=${1}&sort=${'DESC'}&detailTags=${'전체'}
    )}`,
  );
  const {
    hotArticleList,
    articleList,
    recommendArticleList,
    pageable,
    user,
  }: ResponsePortfolioMain = await response.json();

  if (articleList)
    return (
      <section>
        <div className="flex flex-col items-center w-full min-h-screen text-white ">
          <MainNavbar />
          <h1 className="w-full mt-[65px] mb-[48px] text-3xl font-semibold">
            {LOGGEDIN_SECTION_HEADINGS.hot}
          </h1>
          <DetailCategoriesContainer />
          <HotItemsContainer data={hotArticleList} />
          <PortfolioContainer data={articleList} />
          <RecommendContainer data={recommendArticleList} />
        </div>
        <Footer />
      </section>
    );
}
