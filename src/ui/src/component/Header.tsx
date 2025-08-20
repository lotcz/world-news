import React, {useContext} from 'react';
import {Stack} from "react-bootstrap";
import {BsMoonFill, BsSunFill} from "react-icons/bs";
import {WnUserSessionContext, WnUserSessionUpdateContext} from "../util/WnUserSession";
import {IconSwitch} from "zavadil-react-common";

function Header() {
	const session = useContext(WnUserSessionContext);
	const sessionUpdate = useContext(WnUserSessionUpdateContext);
	const isDark = session.theme === 'dark';

	return (
		<header className={`p-3 bg-body-secondary`}>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1>WorldNews</h1>
				<div className="d-flex gap-2 p-2 rounded bg-body text-body">
					<IconSwitch
						checked={!isDark}
						onChange={
							() => {
								session.theme = isDark ? "light" : "dark";
								if (sessionUpdate) sessionUpdate({...session});
							}
						}
						iconOn={<BsSunFill/>}
						iconOff={<BsMoonFill/>}
					/>
				</div>
			</Stack>
		</header>
	);
}

export default Header;
