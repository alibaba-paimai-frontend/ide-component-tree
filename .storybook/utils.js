
import wInfoStyle from "./styles.json";
export function wInfo(md) {
    return {
        info: { inline: true, source: false, header: true, styles: wInfoStyle, text: md }
    };
}