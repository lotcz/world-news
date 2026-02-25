import React from 'react';
import {Route, Routes} from 'react-router';
import Dashboard from "./dashboard/Dashboard";
import MainMenu from "./MainMenu";
import {Stack} from "react-bootstrap";
import LanguagesList from "./languages/LanguagesList";
import LanguageDetail from "./languages/LanguageDetail";
import RealmsList from "./realms/RealmsList";
import RealmDetail from "./realms/RealmDetail";
import ArticleSourcesList from "./articleSources/ArticleSourcesList";
import ArticleSourceDetail from "./articleSources/ArticleSourceDetail";
import ArticlesList from "./articles/ArticlesList";
import ArticleDetail from "./articles/ArticleDetail";
import AiLogList from "./ailog/AiLogList";
import TopicsList from "./topics/TopicsList";
import TopicDetail from "./topics/TopicDetail";
import AiLogDetail from "./ailog/AiLogDetail";
import ImagesList from "./images/ImagesList";
import ImageDetail from "./images/ImageDetail";
import WebsitesList from "./websites/WebsitesList";
import WebsiteDetail from "./websites/WebsiteDetail";
import BannersList from "./banners/BannersList";
import BannerDetail from "./banners/BannerDetail";
import ApproveTopicsForCompilation from "./check/ApproveTopicsForCompilation";
import ApproveArticlesForPublication from "./check/ApproveArticlesForPublication";
import SupplyTopicImages from "./check/SupplyTopicImages";
import CountriesList from "./country/CountriesList";
import CountryDetail from "./country/CountryDetail";

export default function Main() {
	return (
		<main>
			<Stack direction="horizontal" className="align-items-stretch">
				<MainMenu/>
				<div className="flex-grow-1 pb-4">
					<Routes>
						<Route path="/" element={<Dashboard/>}/>
						<Route path="approve-topics">
							<Route path="" element={<ApproveTopicsForCompilation/>}/>
							<Route path=":pagingString" element={<ApproveTopicsForCompilation/>}/>
						</Route>
						<Route path="approve-articles">
							<Route path="" element={<ApproveArticlesForPublication/>}/>
							<Route path=":pagingString" element={<ApproveArticlesForPublication/>}/>
						</Route>
						<Route path="supply-images">
							<Route path="" element={<SupplyTopicImages/>}/>
							<Route path=":pagingString" element={<SupplyTopicImages/>}/>
						</Route>
						<Route path="ai-log">
							<Route path="" element={<AiLogList/>}/>
							<Route path="detail">
								<Route path=":id" element={<AiLogDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<AiLogList/>}/>
						</Route>
						<Route path="languages">
							<Route path="" element={<LanguagesList/>}/>
							<Route path="detail">
								<Route path="add" element={<LanguageDetail/>}/>
								<Route path=":id" element={<LanguageDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<LanguagesList/>}/>
						</Route>
						<Route path="countries">
							<Route path="" element={<CountriesList/>}/>
							<Route path="detail">
								<Route path="add" element={<CountryDetail/>}/>
								<Route path=":id" element={<CountryDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<CountriesList/>}/>
						</Route>
						<Route path="realms">
							<Route path="" element={<RealmsList activeTab="tree"/>}/>
							<Route path="tree" element={<RealmsList activeTab="tree"/>}/>
							<Route path="tree/:expanded" element={<RealmsList activeTab="tree"/>}/>
							<Route path="table" element={<RealmsList activeTab="table"/>}/>
							<Route path="table/:pagingString" element={<RealmsList activeTab="table"/>}/>
							<Route path="detail">
								<Route path="add" element={<RealmDetail/>}/>
								<Route path="add/:parentId" element={<RealmDetail/>}/>
								<Route path=":id" element={<RealmDetail/>}/>
							</Route>
						</Route>
						<Route path="article-sources">
							<Route path="" element={<ArticleSourcesList/>}/>
							<Route path="detail">
								<Route path="add" element={<ArticleSourceDetail/>}/>
								<Route path=":id" element={<ArticleSourceDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<ArticleSourcesList/>}/>
						</Route>
						<Route path="topics">
							<Route path="" element={<TopicsList/>}/>
							<Route path="detail">
								<Route path="add" element={<TopicDetail/>}/>
								<Route path=":id" element={<TopicDetail/>}/>
							</Route>
							<Route path=":pagingString/:published" element={<TopicsList/>}/>
							<Route path=":pagingString" element={<TopicsList/>}/>
						</Route>
						<Route path="articles">
							<Route path="" element={<ArticlesList/>}/>
							<Route path="detail">
								<Route path="add" element={<ArticleDetail/>}/>
								<Route path=":id" element={<ArticleDetail/>}/>
							</Route>
							<Route path=":pagingString/:published/:internal" element={<ArticlesList/>}/>
							<Route path=":pagingString" element={<ArticlesList/>}/>
						</Route>
						<Route path="images">
							<Route path="" element={<ImagesList/>}/>
							<Route path="detail">
								<Route path="add" element={<ImageDetail/>}/>
								<Route path=":id" element={<ImageDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<ImagesList/>}/>
						</Route>
						<Route path="websites">
							<Route path="" element={<WebsitesList/>}/>
							<Route path="detail">
								<Route path="add" element={<WebsiteDetail/>}/>
								<Route path=":id" element={<WebsiteDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<WebsitesList/>}/>
						</Route>
						<Route path="banners">
							<Route path="" element={<BannersList/>}/>
							<Route path="detail">
								<Route path="add" element={<BannerDetail/>}/>
								<Route path="add/:websiteId" element={<BannerDetail/>}/>
								<Route path=":id" element={<BannerDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<BannersList/>}/>
						</Route>
						<Route path="*" element={<span>404</span>}/>
					</Routes>
				</div>
			</Stack>
		</main>
	);
}
