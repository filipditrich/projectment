const config = (prod?: boolean) => {
	return prod ? {
		APP_NAME: "Správa DP a MP",
		APP_LOGO: {
			NAME: "logo-pslib",
			EXT: "svg",
		},
	} : {
		APP_NAME: "ProjectMent",
		APP_LOGO: {
			NAME: "logo-projectment",
			EXT: "png",
		},
	};
};

export default config(false);
