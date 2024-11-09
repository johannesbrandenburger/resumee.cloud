import { PreviewLinkComponent } from '~/app/_components/preview-link';
import Link from 'next/link';

// replace markdown style links "[link text](url)" with next links
export const replaceMdWithNextLinks = (text: string): (JSX.Element | string)[] => {
    
    // go through the text and replace the markdown links with next links
    const regex = /\[(.*?)\]\((.*?)\)/g;
    let parts = text.split(regex);
    let result = [];
    for (let i = 0; i < parts.length; i++) {
        if (i % 3 === 0) {
            result.push(parts[i]);
        } else if (i % 3 === 1) {
            // result.push(<Link className='a-bit-blue dark:text-blue-400 text-blue-700' key={parts[i + 1]} href={parts[i + 1]}>{parts[i]}</Link>);
            result.push(<PreviewLinkComponent key={parts[i + 1]} href={parts[i + 1] || ""}>{parts[i]}</PreviewLinkComponent>);
        }
    }

    // go through the result and replace "\n " with <br />
    let resultWithBreaks = [];
    for (let i = 0; i < result.length; i++) {

        // if it is a JSX element, just push it
        if (typeof result[i] !== "string") {
            resultWithBreaks.push(result[i]);
            continue;
        }

        // if it is a string, split it by "<br />" and push the parts with <br />
        // @ts-ignore
        let parts = result[i].split("<br />");
        for (let j = 0; j < parts.length; j++) {
            resultWithBreaks.push(parts[j]);
            if (j < parts.length - 1) {
                resultWithBreaks.push(<br key={i + j} />);
            }
        }
    }

    return resultWithBreaks;
}