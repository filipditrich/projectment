import { Application } from "../config";

/**
 * Logo Importer
 * @param size
 * @param assetsPath
 */
export default function importLogo(size: "lg" | "sm" | "text", assetsPath: string = "../assets/img/"): ImageData | any {
	return require(`../assets/img/${ Application.APP_LOGO.NAME }-${ size }.${ Application.APP_LOGO.EXT }`);
}
