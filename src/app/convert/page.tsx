'use client'

import { useRef, useState } from "react"

export default function page() {
    const ref = useRef<HTMLTextAreaElement>(null)
    const token = useRef<HTMLTextAreaElement>(null)
    const id = useRef<HTMLTextAreaElement>(null)
    const [string, setString] = useState([] as { q: string, r: string }[])

    const handler = () => {
        function htmlToString(html: string) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const blockTags = new Set([
                'P', 'DIV', 'BR', 'LI', 'UL', 'OL',
                'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
                'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'NAV', 'ASIDE', 'TABLE', 'TR', 'TD', 'TH', 'PRE'
            ]);

            function walk(node: Node) {
                let out = '';
                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        out += child.textContent!.replace(/\s+/g, ' ');
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const tag = child.nodeName;
                        if (tag === 'BR') {
                            out += '\n';
                        } else {
                            out += walk(child);
                        }
                        if (blockTags.has(tag)) out += '\n';
                    }
                });
                return out;
            }

            // normaliser les retours à la ligne multiples et trim
            return walk(doc.body).replace(/\n{2,}/g, '\n\n').trim();
        }

        const val = ref.current?.value
        const dataLst: any = []
        if (val) {
            const data = JSON.parse(val) as { q: string, r: string }[]

            data.forEach(item => {
                dataLst.push({
                    q: htmlToString(item.q),
                    r: htmlToString(item.r)
                })
            })
            setString(dataLst)
        }


    }

    const handlerSend = () => {
        const body = JSON.stringify(
            {
                files: string.map(item => ({
                    q: item.q,
                    r: item.r,
                    dir_id: id.current?.value
                }))
            })


        fetch("https://api.flashquizz.fr/file/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": token.current?.value || "",
                "origin": "https://app.flashquizz.fr",
                "key": "flashquizz"
            }, body: body
        }).then(res => res.json()).then(json => { console.log(json) })
    }


    return (
        <div>
            <textarea ref={ref}></textarea>
            <input type="text" placeholder="token" />
            <input type="text" placeholder="dir_id" />
            <button onClick={handler}>convert</button>
            <button onClick={handlerSend}>send</button>
            <ul>
                {string.map((item, index) => (
                    <li key={index}>
                        <strong>Q:</strong> {item.q}<br />
                        <strong>R:</strong> {item.r}
                    </li>))}
            </ul>

        </div>
    )
}
