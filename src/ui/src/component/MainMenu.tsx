import React, {useCallback, useContext} from 'react';
import {NavLink, useNavigate} from "react-router";
import {WnUserAlertsContext} from '../util/WnUserAlerts';
import {Localize} from "zavadil-react-common";
import {WnRestClientContext} from "../client/WnRestClient";

function MainMenu() {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);

	const logOut = useCallback(
		() => {
			restClient
				.logout()
				.then(
					() => {
						userAlerts.info("Logged out");
						navigate("/");
					}
				);
		},
		[navigate, restClient, userAlerts]
	);

	return (
		<div className="main-menu px-3">
			<h3 className="mt-2">Manage</h3>
			<div className="ps-3">
				<div>
					<NavLink to="/ai-log">AI Log</NavLink>
				</div>
				<div>
					<NavLink to="/languages">Languages</NavLink>
				</div>
				<div>
					<NavLink to="/realms">Realms</NavLink>
				</div>
				<div className="text-nowrap">
					<NavLink to="/article-sources">Article Sources</NavLink>
				</div>
				<div>
					<NavLink to="/topics">Topics</NavLink>
				</div>
				<div>
					<NavLink to="/articles">Articles</NavLink>
				</div>
			</div>
			<h3 className="mt-2"><Localize text="System"/></h3>
			<div className="ps-3">
				<div className="text-nowrap">
					<NavLink to="/"><Localize text="System State"/></NavLink>
				</div>
				<div>
					<a
						href="/"
						onClick={
							(e) => {
								e.stopPropagation();
								e.preventDefault();
								logOut();
							}
						}
					><Localize text="Log out"/></a>
				</div>
			</div>
		</div>
	);
}

export default MainMenu;
