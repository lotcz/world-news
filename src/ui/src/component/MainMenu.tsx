import React, {useCallback, useContext, useEffect, useState} from 'react';
import {NavLink, useNavigate} from "react-router";
import {WnUserAlertsContext} from '../util/WnUserAlerts';
import {Localize} from "zavadil-react-common";
import {WnRestClientContext} from "../client/WnRestClient";
import {QueueSizes} from "../types/Stats";
import CountBadge from "./general/CountBadge";

function MainMenu() {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [queueSizes, setQueueSizes] = useState<QueueSizes>();

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

	const loadSizes = useCallback(
		() => {
			restClient
				.queues
				.loadSizes()
				.then(setQueueSizes)
				.catch((e) => userAlerts.err(e));
		},
		[restClient, userAlerts]
	);

	useEffect(() => {
		const handler = setInterval(loadSizes, 3000);
		return () => clearInterval(handler);
	}, [loadSizes]);

	return (
		<div className="main-menu p-3">
			<h4>Check</h4>
			<div className="ps-3">
				<div>
					<NavLink to="/approve-topics" className="d-flex align-items-center gap-2">
						<div className="text-nowrap">
							Approve topics
						</div>
						{
							queueSizes && <small><CountBadge count={queueSizes.topicApproval}/></small>
						}
					</NavLink>
				</div>
				<div>
					<NavLink to="/approve-articles" className="d-flex align-items-center gap-2">
						<div className="text-nowrap">
							Approve articles
						</div>
						{
							queueSizes && <small><CountBadge count={queueSizes.articleApproval} bg="success"/></small>
						}
					</NavLink>
				</div>
				<div>
					<NavLink to="/supply-images" className="d-flex align-items-center gap-2">
						<div className="text-nowrap">
							Supply images
						</div>
						{
							queueSizes && <small><CountBadge count={queueSizes.topicImageSupply} bg="warning"/></small>
						}
					</NavLink>
				</div>
			</div>
			<h4 className="mt-2">Manage</h4>
			<div className="ps-3">
				<div>
					<NavLink to="/topics">Topics</NavLink>
				</div>
				<div>
					<NavLink to="/articles">Articles</NavLink>
				</div>
				<div>
					<NavLink to="/ai-log">AI Log</NavLink>
				</div>
				<div>
					<NavLink to="/languages">Languages</NavLink>
				</div>
				<div>
					<NavLink to="/tags">Tags</NavLink>
				</div>
				<div>
					<NavLink to="/realms">Realms</NavLink>
				</div>
				<div className="text-nowrap">
					<NavLink to="/article-sources">Article Sources</NavLink>
				</div>
				<div>
					<NavLink to="/images">Images</NavLink>
				</div>
				<div>
					<NavLink to="/websites">Websites</NavLink>
				</div>
				<div>
					<NavLink to="/banners">Banners</NavLink>
				</div>
			</div>
			<h4 className="mt-2"><Localize text="System"/></h4>
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
