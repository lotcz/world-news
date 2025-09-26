import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SelectableTableHeader, TablePlaceholder, TableWithSelect} from "zavadil-react-common";
import {DateUtil, Page, PagingRequest} from "zavadil-ts-common";
import {useNavigate} from "react-router";
import {WnRestClientContext} from "../../client/WnRestClient";
import {WnUserAlertsContext} from "../../util/WnUserAlerts";
import {Banner} from "../../types/Banner";

export type WebsiteBannersListProps = {
	websiteId: number;
}

const HEADER: SelectableTableHeader<Banner> = [
	{name: 'name', label: 'name'},
	{name: 'type', label: 'Type'},
	{name: 'publishedDate', label: 'Published', renderer: (b) => DateUtil.formatDateTimeForHumans(b.publishDate)},
];

export default function WebsiteBannersList({websiteId}: WebsiteBannersListProps) {
	const navigate = useNavigate();
	const restClient = useContext(WnRestClientContext);
	const userAlerts = useContext(WnUserAlertsContext);
	const [data, setData] = useState<Page<Banner> | null>(null);
	const [paging, setPaging] = useState<PagingRequest>({page: 0, size: 10});

	const navigateToDetail = (b: Banner) => {
		navigate(`/banners/detail/${b.id}`);
	}

	const loadPageHandler = useCallback(
		() => {
			restClient
				.banners
				.loadByWebsite(websiteId, paging)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[paging, websiteId, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging]);

	return (
		<div>
			<div className="pt-2 gap-3">
				{
					(data === null) ? <TablePlaceholder/>
						: (
							<TableWithSelect
								showSelect={false}
								header={HEADER}
								paging={paging}
								totalItems={data.totalItems}
								onPagingChanged={setPaging}
								onClick={navigateToDetail}
								items={data.content}
								hover={true}
								striped={true}
							/>
						)
				}
			</div>
		</div>
	);
}
