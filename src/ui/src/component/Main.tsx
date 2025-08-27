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
import TagsList from "./tags/TagsList";
import TagDetail from "./tags/TagDetail";
import AiLogList from "./ailog/AiLogList";
import TopicsList from "./topics/TopicsList";
import TopicDetail from "./topics/TopicDetail";

function Main() {
	return (
		<main>
			<Stack direction="horizontal" className="align-items-stretch">
				<MainMenu/>
				<div className="flex-grow-1">
					<Routes>
						<Route path="/" element={<Dashboard/>}/>
						<Route path="ai-log">
							<Route path="" element={<AiLogList/>}/>
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
						<Route path="tags">
							<Route path="" element={<TagsList/>}/>
							<Route path="detail">
								<Route path="add" element={<TagDetail/>}/>
								<Route path=":id" element={<TagDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<TagsList/>}/>
						</Route>
						<Route path="realms">
							<Route path="" element={<RealmsList/>}/>
							<Route path="detail">
								<Route path="add" element={<RealmDetail/>}/>
								<Route path=":id" element={<RealmDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<RealmsList/>}/>
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
							<Route path=":pagingString" element={<TopicsList/>}/>
						</Route>
						<Route path="articles">
							<Route path="" element={<ArticlesList/>}/>
							<Route path="detail">
								<Route path="add" element={<ArticleDetail/>}/>
								<Route path=":id" element={<ArticleDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<ArticlesList/>}/>
						</Route>
						<Route path="*" element={<span>404</span>}/>
					</Routes>
				</div>
			</Stack>
		</main>
	);
}

export default Main;
