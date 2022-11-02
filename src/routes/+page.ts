import type { PageLoad } from './$types';

export const load: PageLoad = (event) => {
	return {
		title: 'BDO Combat Analyzer',
		description: 'A website allowing you to analyze your combat logs from Nodewars and GvGs'
	};
};
