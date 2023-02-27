// ReportPerform.js
// ================
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// This was added by CRA. For more on this:
//
//   https://create-react-app.dev/docs/measuring-performance/
//
const ReportPerform = onPerfEntry => {
	if (onPerfEntry && onPerfEntry instanceof Function) {
		import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
			getCLS(onPerfEntry);
			getFID(onPerfEntry);
			getFCP(onPerfEntry);
			getLCP(onPerfEntry);
			getTTFB(onPerfEntry);
		});
	}
};

export default ReportPerform;
