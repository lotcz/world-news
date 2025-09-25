import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {WnUserAlertsContext} from "../util/WnUserAlerts";
import {WnUserSession, WnUserSessionContext, WnUserSessionUpdateContext} from "../util/WnUserSession";
import {
	ConfirmDialog,
	ConfirmDialogContext,
	ConfirmDialogContextData,
	ConfirmDialogProps,
	IconButton,
	Localize,
	Spread,
	UserAlertsWidget
} from "zavadil-react-common";
import {Spinner} from "react-bootstrap";
import {BrowserRouter} from "react-router";
import {WaitingDialogContext, WaitingDialogContextContent} from "../util/WaitingDialogContext";
import WaitingDialog, {WaitingDialogProps} from "./general/WaitingDialog";
import {BsRepeat} from "react-icons/bs";
import {WnRestClientContext} from "../client/WnRestClient";
import {SupplyImageModal, SupplyImageModalProps} from "./images/supply/SupplyImageModal";
import {SupplyImageDialogContext, SupplyImageDialogContextContent} from "../util/SupplyImageDialogContext";

export default function App() {
	const userAlerts = useContext(WnUserAlertsContext);
	const restClient = useContext(WnRestClientContext);
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
	const [waitingDialog, setWaitingDialog] = useState<WaitingDialogProps>();
	const [supplyImageDialog, setSupplyImageDialog] = useState<SupplyImageModalProps>();
	const [session, setSession] = useState<WnUserSession>(new WnUserSession());
	const [initialized, setInitialized] = useState<boolean>();
	const [showAlerts, setShowAlerts] = useState<boolean>();

	const updateSession = useCallback(
		(s: WnUserSession) => {
			document.documentElement.dataset.bsTheme = s.theme;
			localStorage.setItem('okarina-session', JSON.stringify(s));
			setSession({...s});
		},
		[]
	);

	const confirmDialogContext = useMemo<ConfirmDialogContextData>(
		() => new ConfirmDialogContextData(setConfirmDialog),
		[]
	);

	const waitingDialogContext = useMemo<WaitingDialogContextContent>(
		() => {
			return {
				show: (text, onCancel) => {
					setWaitingDialog({text: text, onCancel: onCancel, onClose: () => onCancel ? onCancel() : null});
				},
				progress: (progress?: number, max?: number) => {
					if (!waitingDialog) return;
					waitingDialog.progress = progress;
					waitingDialog.max = max;
					setWaitingDialog({...waitingDialog});
				},
				hide: () => {
					setWaitingDialog(undefined);
				}
			}
		},
		[waitingDialog]
	);

	const supplyImageDialogContext = useMemo<SupplyImageDialogContextContent>(
		() => {
			return {
				show: (props: SupplyImageModalProps) => setSupplyImageDialog(props),
				hide: () => setSupplyImageDialog(undefined)
			}
		},
		[]
	);

	const restInitialize = useCallback(
		() => {
			setInitialized(undefined);
			try {
				restClient
					.initialize()
					.then(() => setInitialized(true))
					.catch(
						(e) => {
							userAlerts.err(`Rest initialization failed: ${e}`);
							setInitialized(false);
						});
			} catch (e: any) {
				userAlerts.err(`Rest initialization failed: ${e}`);
				setInitialized(false);
			}
		},
		[restClient, userAlerts]
	);

	const alertsChanged = useCallback(
		() => {
			setShowAlerts(userAlerts.alerts.length > 0);
		},
		[userAlerts]
	);

	useEffect(() => {
			userAlerts.addOnChangeHandler(alertsChanged);

			// session
			const sessionRaw = localStorage.getItem('wn-session');
			if (sessionRaw) {
				updateSession(JSON.parse(sessionRaw));
			}

			// rest client
			restInitialize();

			return () => {
				userAlerts.removeOnChangeHandler(alertsChanged);
			}
		},
		[]
	);

	return (
		<WnUserSessionContext.Provider value={session}>
			<WnUserSessionUpdateContext.Provider value={updateSession}>
				<SupplyImageDialogContext.Provider value={supplyImageDialogContext}>
					<WaitingDialogContext.Provider value={waitingDialogContext}>
						<ConfirmDialogContext.Provider value={confirmDialogContext}>
							<BrowserRouter>
								<div className="min-h-100 d-flex flex-column align-items-stretch">
									{
										(initialized === undefined) && <Spread>
											<div className="d-flex flex-column align-items-center">
												<div><Spinner/></div>
												<div><Localize text="Initializing"/></div>
											</div>
										</Spread>
									}
									{
										(initialized === false) && <Spread>
											<div className="d-flex flex-column align-items-center">
												<div className="p-3"><Localize text="Initialization failed!"/></div>
												<div>
													<IconButton onClick={restInitialize} icon={<BsRepeat/>}>
														<Localize text="Try again"/>
													</IconButton>
												</div>
											</div>
										</Spread>
									}
									{
										(initialized === true) && <>
											<Header/>
											<Main/>
											<Footer/>
										</>
									}
									{
										confirmDialog && <ConfirmDialog {...confirmDialog} />
									}
									{
										waitingDialog && <WaitingDialog {...waitingDialog} />
									}
									{
										supplyImageDialog && <SupplyImageModal {...supplyImageDialog} />
									}
									{
										showAlerts && <UserAlertsWidget userAlerts={userAlerts}/>
									}
								</div>
							</BrowserRouter>
						</ConfirmDialogContext.Provider>
					</WaitingDialogContext.Provider>
				</SupplyImageDialogContext.Provider>
			</WnUserSessionUpdateContext.Provider>
		</WnUserSessionContext.Provider>
	)
}
