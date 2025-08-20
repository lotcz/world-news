import React from 'react';
import {Route, Routes} from 'react-router';
import Dashboard from "./dashboard/Dashboard";
import MainMenu from "./MainMenu";
import {Stack} from "react-bootstrap";
import LanguagesList from "./languages/LanguagesList";
import LanguageDetail from "./languages/LanguageDetail";

function Main() {
	return (
		<main>
			<Stack direction="horizontal" className="align-items-stretch">
				<MainMenu/>
				<div className="flex-grow-1">
					<Routes>
						<Route path="/" element={<Dashboard/>}/>
						<Route path="languages">
							<Route path="" element={<LanguagesList/>}/>
							<Route path="detail">
								<Route path="add" element={<LanguageDetail/>}/>
								<Route path=":id" element={<LanguageDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<LanguagesList/>}/>
						</Route>
						<Route path="*" element={<span>404</span>}/>
					</Routes>
				</div>
			</Stack>
		</main>
	);
}

export default Main;
