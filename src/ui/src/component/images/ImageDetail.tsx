import {Button, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {FaFloppyDisk} from "react-icons/fa6";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {Image} from "../../types/Image";
import ImageForm from "./ImageForm";
import {ConfirmDialogContext} from "zavadil-react-common";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'articles';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 1;
const COL_2_LG = 6;

export default function ImageDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<Image>();
	const [changed, setChanged] = useState<boolean>(false);

	useEffect(
		() => {
			if (!activeTab) return;
			searchParams.set(TAB_PARAM_NAME, activeTab);
			setSearchParams(searchParams, {replace: true});
		},
		[activeTab]
	);

	useEffect(
		() => {
			setActiveTab(StringUtil.getNonEmpty(searchParams.get(TAB_PARAM_NAME), DEFAULT_TAB));
		},
		[id]
	);

	const reload = useCallback(
		() => {
			if (!id) {
				setData({
					name: ''
				});
				return;
			}
			setData(undefined);
			restClient.images.loadSingle(Number(id))
				.then(setData)
				.catch((e: Error) => userAlerts.err(e))
		},
		[id, restClient, userAlerts]
	);

	useEffect(reload, [id]);

	const saveData = useCallback(
		() => {
			if (!data) return;
			const inserting = NumberUtil.isEmpty(data.id);
			restClient
				.images
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/images/detail/${f.id}`, {replace: true});
						} else {
							setData(f);
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
		},
		[restClient, data, userAlerts, navigate]
	);

	const deleteImage = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this image?',
				() => restClient
					.images
					.delete(Number(data.id))
					.then(
						(f) => {
							navigate(-1);
						})
					.catch((e: Error) => userAlerts.err(e))
			);
		},
		[restClient, data, userAlerts, navigate, confirmDialog]
	);

	if (!data) {
		return <Spinner/>
	}

	return (
		<div>
			<div className="p-2">
				<Stack direction="horizontal" gap={2}>
					<Button variant="link" onClick={() => navigate(-1)}>Back</Button>
					<RefreshIconButton onClick={reload}/>
					<Button
						disabled={!changed}
						onClick={saveData}
						className="d-flex gap-2 align-items-center text-nowrap"
					>
						<div className="d-flex align-items-center gap-2">
							<FaFloppyDisk/>
							<div>Save</div>
						</div>
					</Button>
					<Button variant="danger" onClick={deleteImage}>Delete</Button>
				</Stack>
			</div>
			<div className="px-3 w-75">
				<ImageForm
					data={data}
					onChange={
						() => {
							setData({...data});
							setChanged(true);
						}
					}
				/>
			</div>
			{
				data.id && <div>
					<Tabs
						activeKey={activeTab}
						onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}
					>
						<Tab title="Topics" eventKey="topics"/>
						<Tab title="Articles" eventKey="articles"/>
					</Tabs>
					<div className="px-3 py-1">
						{
							activeTab === 'topics' && <div>topics</div>
						}
						{
							activeTab === 'articles' && <div>articles</div>
						}
					</div>
				</div>
			}
		</div>
	)
}
