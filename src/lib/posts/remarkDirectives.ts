type MdastNode = {
    type?: string;
    name?: string;
    value?: string;
    attributes?: Record<string, string>;
    children?: MdastNode[];
    data?: {
        hName?: string;
        hProperties?: Record<string, unknown>;
        hChildren?: HastNode[];
    };
};

type HastNode =
    | { type: 'text'; value: string }
    | {
          type: 'element';
          tagName: string;
          properties?: Record<string, unknown>;
          children?: HastNode[];
      };

const CALLOUTS = new Set(['note', 'tip', 'warn', 'quote']);

function visit(node: MdastNode, fn: (node: MdastNode) => void) {
    fn(node);
    if (!Array.isArray(node.children)) return;
    for (const child of node.children) {
        visit(child, fn);
    }
}

function text(value: string): HastNode {
    return { type: 'text', value };
}

function element(tagName: string, properties?: Record<string, unknown>, children: HastNode[] = []): HastNode {
    return {
        type: 'element',
        tagName,
        properties,
        children,
    };
}

function nodeText(node?: MdastNode | MdastNode[]): string {
    if (!node) return '';
    if (Array.isArray(node)) return node.map(nodeText).join('');
    if (typeof node.value === 'string') return node.value;
    if (!Array.isArray(node.children)) return '';
    return node.children.map(nodeText).join('');
}

function mediaId(node: MdastNode) {
    return node.attributes?.id || node.attributes?.video || node.attributes?.bvid || node.attributes?.src || '';
}

function mediaCaption(node: MdastNode) {
    return nodeText(node.children).trim();
}

function mediaSrc(name: string, id: string) {
    if (name === 'youtube') {
        return `https://www.youtube.com/embed/${id}`;
    }
    if (name === 'bilibili') {
        return `https://player.bilibili.com/player.html?bvid=${id}&page=1`;
    }
    return '';
}

export default function remarkDirectives() {
    return (tree: MdastNode) => {
        visit(tree, (node) => {
            if (!node.type || !node.name) return;
            if (!['containerDirective', 'leafDirective', 'textDirective'].includes(node.type)) return;

            const data = node.data || (node.data = {});

            if (CALLOUTS.has(node.name)) {
                const title =
                    node.attributes?.title ||
                    {
                        note: 'Note',
                        tip: 'Tip',
                        warn: 'Warning',
                        quote: 'Quote',
                    }[node.name] ||
                    'Note';

                data.hName = 'div';
                data.hProperties = {
                    className: ['notes-callout', `notes-callout--${node.name}`],
                    'data-callout-title': title,
                };
                return;
            }

            if (node.name !== 'youtube' && node.name !== 'bilibili') return;

            const id = mediaId(node).trim();
            if (!id) return;

            const src = mediaSrc(node.name, id);
            const caption = mediaCaption(node);

            data.hName = 'figure';
            data.hProperties = {
                className: ['notes-embed', `notes-embed--${node.name}`],
            };
            data.hChildren = [
                element('div', { className: ['notes-embed-frame'] }, [
                    element('iframe', {
                        src,
                        loading: 'lazy',
                        allowFullScreen: true,
                        className: ['notes-embed-iframe'],
                    }),
                ]),
                ...(caption
                    ? [
                          element('figcaption', { className: ['notes-embed-caption'] }, [
                              text(caption),
                          ]),
                      ]
                    : []),
            ];
        });
    };
}
